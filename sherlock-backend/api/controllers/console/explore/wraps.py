from collections.abc import Callable
from functools import wraps
from typing import Concatenate, ParamSpec, TypeVar

from flask_restx import Resource
from werkzeug.exceptions import NotFound, Forbidden
from libs.login import current_user
from controllers.console.explore.error import AppAccessDeniedError
from controllers.console.wraps import account_initialization_required
from extensions.ext_database import db
from libs.login import current_account_with_tenant, login_required
from models import InstalledApp
from models.account import TenantAccountRole
from services.app_service import AppService
from services.enterprise.enterprise_service import EnterpriseService
from services.feature_service import FeatureService
from models.dataset import DatasetPermissionEnum
from services.account_service import AccountAppJoinService, TenantService


P = ParamSpec("P")
R = TypeVar("R")
T = TypeVar("T")

def installed_app_roles_required(view=None):
    def decorator(view):
        @wraps(view)
        def decorated(roles: list[TenantAccountRole], installed_app: InstalledApp, *args, **kwargs):
            user = current_user
            app = installed_app.app
            if not app:
                raise NotFound('app not found')

            access_type = app.access_type
            role_str = TenantService.get_user_role(current_user, current_user.current_tenant)
            role = TenantAccountRole(role_str) if role_str else None
            if not TenantAccountRole.is_privileged_role(role):
                match access_type:
                    case DatasetPermissionEnum.ONLY_ME:
                        if not app.created_by == user.id:
                            raise Forbidden()
                    case DatasetPermissionEnum.PARTIAL_TEAM:
                        if not app.created_by == user.id:
                            if not AccountAppJoinService.check_app_access_by_role(user, roles, app.id):
                                raise Forbidden()
            return view(installed_app, *args, **kwargs)
        return decorated

    if view:
        return decorator(view)
    return decorator


def installed_app_required(view: Callable[Concatenate[InstalledApp, P], R] | None = None):
    def decorator(view: Callable[Concatenate[InstalledApp, P], R]):
        @wraps(view)
        def decorated(installed_app_id: str, *args: P.args, **kwargs: P.kwargs):
            _, current_tenant_id = current_account_with_tenant()
            installed_app = (
                db.session.query(InstalledApp)
                .where(InstalledApp.id == str(installed_app_id), InstalledApp.tenant_id == current_tenant_id)
                .first()
            )

            if installed_app is None:
                raise NotFound("Installed app not found")

            if not installed_app.app:
                db.session.delete(installed_app)
                db.session.commit()

                raise NotFound("Installed app not found")

            return view([TenantAccountRole.ADMIN, TenantAccountRole.OWNER],
                        installed_app, *args, **kwargs)

        return decorated

    if view:
        return decorator(view)
    return decorator


def user_allowed_to_access_app(view: Callable[Concatenate[InstalledApp, P], R] | None = None):
    def decorator(view: Callable[Concatenate[InstalledApp, P], R]):
        @wraps(view)
        def decorated(installed_app: InstalledApp, *args: P.args, **kwargs: P.kwargs):
            current_user, _ = current_account_with_tenant()
            feature = FeatureService.get_system_features()
            if feature.webapp_auth.enabled:
                app_id = installed_app.app_id
                res = EnterpriseService.WebAppAuth.is_user_allowed_to_access_webapp(
                    user_id=str(current_user.id),
                    app_id=app_id,
                )
                if not res:
                    raise AppAccessDeniedError()

            return view(installed_app, *args, **kwargs)

        return decorated

    if view:
        return decorator(view)
    return decorator


class InstalledAppResource(Resource):
    # must be reversed if there are multiple decorators

    method_decorators = [
        installed_app_roles_required,
        user_allowed_to_access_app,
        installed_app_required,
        account_initialization_required,
        login_required,
    ]
