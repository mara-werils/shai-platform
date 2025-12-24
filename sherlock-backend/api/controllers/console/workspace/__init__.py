from collections.abc import Callable
from functools import wraps
from typing import ParamSpec, TypeVar
from flask_login import current_user
from sqlalchemy.orm import Session
from werkzeug.exceptions import Forbidden
from typing import Optional
from extensions.ext_database import db
from libs.login import current_account_with_tenant
from models.account import TenantPluginPermission

P = ParamSpec("P")
R = TypeVar("R")

from services.account_service import TenantService, AccountAppJoinService
from models.account import TenantAccountRole
from models import App
from models.dataset import DatasetPermissionEnum
from werkzeug.exceptions import NotFound



def plugin_permission_required(
    install_required: bool = False,
    debug_required: bool = False,
):
    def interceptor(view: Callable[P, R]):
        @wraps(view)
        def decorated(*args: P.args, **kwargs: P.kwargs):
            current_user, current_tenant_id = current_account_with_tenant()
            user = current_user
            tenant_id = current_tenant_id

            with Session(db.engine) as session:
                permission = (
                    session.query(TenantPluginPermission)
                    .where(
                        TenantPluginPermission.tenant_id == tenant_id,
                    )
                    .first()
                )

                if not permission:
                    # no permission set, allow access for everyone
                    return view(*args, **kwargs)

                if install_required:
                    if permission.install_permission == TenantPluginPermission.InstallPermission.NOBODY:
                        raise Forbidden()
                    if permission.install_permission == TenantPluginPermission.InstallPermission.ADMINS:
                        if not user.is_admin_or_owner:
                            raise Forbidden()
                    if permission.install_permission == TenantPluginPermission.InstallPermission.EVERYONE:
                        pass

                if debug_required:
                    if permission.debug_permission == TenantPluginPermission.DebugPermission.NOBODY:
                        raise Forbidden()
                    if permission.debug_permission == TenantPluginPermission.DebugPermission.ADMINS:
                        if not user.is_admin_or_owner:
                            raise Forbidden()
                    if permission.debug_permission == TenantPluginPermission.DebugPermission.EVERYONE:
                        pass

            return view(*args, **kwargs)

        return decorated

    return interceptor


def roles_required(roles: list[TenantAccountRole]):
    def decorator(view):
        @wraps(view)
        def decorated(*args, **kwargs):
            user = current_user
            if not TenantService.check_valid_role(user, roles):
                raise Forbidden()
            return view(*args, **kwargs)
        return decorated
    return decorator


def app_roles_required(roles: list[TenantAccountRole]):
    def decorator(view):
        @wraps(view)
        def decorated(*args, **kwargs):
            user = current_user
            if not kwargs.get("app_id"):
                raise ValueError("missing app_id in path parameters")

            app_id = kwargs.get("app_id")
            app_id = str(app_id)
            app = db.session.query(App).filter(App.id == app_id).first()
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
                            if not AccountAppJoinService.check_app_access_by_role(user, roles, app_id):
                                raise Forbidden()
            return view(*args, **kwargs)
        return decorated
    return decorator