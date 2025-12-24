from typing import Any

from sqlalchemy.orm import Session

from extensions.ext_database import db
from models import App, Workflow
from models.model import AppMode


class AppParametersService:
    """Service for extracting application parameters and input fields."""
    
    def get_all_apps_parameters(self, tenant_id: str, user_id: str) -> dict[str, Any]:
        """
        Get parameters for all applications in the tenant.
        
        Args:
            tenant_id: Tenant ID
            user_id: User ID
            
        Returns:
            Dictionary containing all apps with their parameters
        """
        with Session(db.engine) as session:
            # Get all apps for the tenant
            apps = session.query(App).filter(
                App.tenant_id == tenant_id,
                App.is_demo == False
            ).all()
            
            apps_parameters = {}
            
            for app in apps:
                try:
                    app_params = self._extract_app_parameters(app)
                    apps_parameters[str(app.id)] = {
                        "app_id": str(app.id),
                        "name": app.name,
                        "description": app.description,
                        "mode": app.mode,
                        "parameters": app_params
                    }
                except Exception as e:
                    # Log error but continue with other apps
                    apps_parameters[str(app.id)] = {
                        "app_id": str(app.id),
                        "name": app.name,
                        "description": app.description,
                        "mode": app.mode,
                        "error": f"Failed to extract parameters: {str(e)}",
                        "parameters": None
                    }
            
            return {
                "total_apps": len(apps),
                "apps": apps_parameters
            }
    
    def get_app_parameters_by_id(self, app_id: str, tenant_id: str) -> dict[str, Any]:
        """
        Get parameters for a specific application.
        
        Args:
            app_id: Application ID
            tenant_id: Tenant ID
            
        Returns:
            Dictionary containing app parameters
        """
        with Session(db.engine) as session:
            app = session.query(App).filter(
                App.id == app_id,
                App.tenant_id == tenant_id
            ).first()
            
            if not app:
                raise ValueError(f"App with ID {app_id} not found")
            
            app_params = self._extract_app_parameters(app)
            
            return {
                "app_id": str(app.id),
                "name": app.name,
                "description": app.description,
                "mode": app.mode,
                "parameters": app_params
            }
    
    def _extract_app_parameters(self, app: App) -> dict[str, Any]:
        """
        Extract parameters from an app model.
        
        Args:
            app: App model instance
            
        Returns:
            Dictionary containing app parameters
        """
        try:
            if app.mode in {AppMode.ADVANCED_CHAT.value, AppMode.WORKFLOW.value}:
                # For workflow-based apps
                workflow = db.session.query(Workflow).filter(Workflow.id == app.workflow_id).first()
                if workflow is None:
                    return {"error": "Workflow not found"}
                
                features_dict = workflow.features_dict
                user_input_form = workflow.user_input_form(to_old_structure=False)
            else:
                # For other app types
                app_model_config = app.app_model_config
                if app_model_config is None:
                    return {"error": "App model config not found"}
                
                features_dict = app_model_config.to_dict()
                user_input_form = features_dict.get("user_input_form", [])
            
            # Get parameters using existing function

            # Extract input fields with their types
            input_fields = self._extract_input_fields(user_input_form)
            if isinstance(input_fields, list):
                for input_field in input_fields:
                    if isinstance(input_field, dict):
                        field_type = input_field.get("type")
                        if field_type is not None:
                            input_field["type"] = self._map_field_type_to_data_type(field_type)


            
            return {
                "input_fields": input_fields
            }
            
        except Exception as e:
            return {"error": f"Failed to extract parameters: {str(e)}"}
    
    def get_app_input_parameters(self, app_id: str, tenant_id: str) -> dict[str, Any]:
        """
        Get input parameters for a specific application in orchestration format.
        
        Args:
            app_id: Application ID
            tenant_id: Tenant ID
            
        Returns:
            Dictionary containing input parameters in orchestration format
        """
        with Session(db.engine) as session:
            app = session.query(App).filter(
                App.id == app_id,
                App.tenant_id == tenant_id
            ).first()
            
            if not app:
                raise ValueError(f"App with ID {app_id} not found")
            
            # Get user input form based on app mode
            if app.mode in {AppMode.ADVANCED_CHAT.value, AppMode.WORKFLOW.value}:
                # For workflow-based apps
                workflow = app.workflow
                if workflow is None:
                    raise ValueError("Workflow not found")
                user_input_form = workflow.user_input_form(to_old_structure=True)
            else:
                # For other app types
                app_model_config = app.app_model_config
                if app_model_config is None:
                    raise ValueError("App model config not found")
                features_dict = app_model_config.to_dict()
                user_input_form = features_dict.get("user_input_form", [])
            
            # Extract input fields in orchestration format
            input_parameters = self._extract_orchestration_input_fields(user_input_form)
            
            return {
                "app_id": str(app.id),
                "name": app.name,
                "description": app.description,
                "mode": app.mode,
                "input_parameters": input_parameters
            }
    
    def _extract_input_fields(self, user_input_form: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """
        Extract input fields with their types from user input form.
        
        Args:
            user_input_form: List of input form configurations
            
        Returns:
            List of input fields with their types and properties
        """
        input_fields = []
        
        for field in user_input_form:
            field_info = {
                "type": field.get("type", "unknown"),
                "label": field.get("label", ""),
                "variable": field.get("variable", ""),
                "required": field.get("required", False),
                "default": field.get("default", None),
            }
            
            # Add type-specific properties
            if field.get("type") == "select":
                field_info["options"] = field.get("options", [])
            elif field.get("type") == "text-input" or field.get("type") == "paragraph":
                field_info["max_length"] = field.get("max_length")
                field_info["placeholder"] = field.get("placeholder")
            
            input_fields.append(field_info)
        
        return input_fields
    
    def _extract_orchestration_input_fields(self, user_input_form: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """
        Extract input fields in orchestration format with data types.
        
        Args:
            user_input_form: List of input form configurations
            
        Returns:
            List of input fields in orchestration format with data types
        """
        input_parameters = []
        
        for field in user_input_form:
            # Map form field types to orchestration data types
            data_type = self._map_field_type_to_data_type(field.get("type", "text-input"))
            
            field_info = {
                "variable": field.get("variable", ""),
                "label": field.get("label", ""),
                "type": data_type,
                "required": field.get("required", False),
                "default": field.get("default", None),
                "description": field.get("description", ""),
                "form_type": field.get("type", "text-input"),  # Original form type
            }
            
            # Add type-specific properties
            if field.get("type") == "select":
                field_info["options"] = field.get("options", [])
            elif field.get("type") in ["text-input", "paragraph"]:
                field_info["max_length"] = field.get("max_length")
                field_info["placeholder"] = field.get("placeholder")
            elif field.get("type") == "number-input":
                field_info["min"] = field.get("min")
                field_info["max"] = field.get("max")
                field_info["step"] = field.get("step")
            
            input_parameters.append(field_info)
        
        return input_parameters
    
    def _map_field_type_to_data_type(self, form_type: str) -> str:
        """
        Map form field type to orchestration data type.
        
        Args:
            form_type: Form field type
            
        Returns:
            Orchestration data type
        """
        type_mapping = {
            "text-input": "string",
            "paragraph": "string", 
            "select": "string",
            "number-input": "number",
            "switch": "boolean",
            "file-upload": "file",
            "image-upload": "file",
            "date-picker": "string",
            "time-picker": "string",
            "datetime-picker": "string",
        }
        
        return type_mapping.get(form_type, "string")


