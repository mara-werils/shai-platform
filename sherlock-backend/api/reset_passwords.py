import base64
import secrets

from extensions.ext_database import db
from libs.password import hash_password
from models.account import Account, Tenant, TenantAccountJoin, TenantAccountRole

workspace_ids = [
   "ad1bfb65-4da0-4bba-a51c-ac76b638ad7b"
]

new_password = 'NewPassword123'

for workspace_id in workspace_ids:
    tenant = db.session.query(Tenant).filter(Tenant.id == workspace_id).first()
    if not tenant:
        print("Workspace '{}' not found".format(workspace_id))
        continue
    owner_join = db.session.query(TenantAccountJoin).filter(
        TenantAccountJoin.tenant_id == tenant.id,
        TenantAccountJoin.role == TenantAccountRole.OWNER.value
    ).first()
    if not owner_join:
        print("owner_join '{}' not found".format(owner_join))
        continue

    account = db.session.query(Account).filter(Account.id == owner_join.account_id).first()
    if not account:
        print("account '{}' not found".format(account))
        continue

    salt = secrets.token_bytes(16)
    base64_salt = base64.b64encode(salt).decode()

    password_hashed = hash_password(new_password, salt)
    base64_password_hashed = base64.b64encode(password_hashed).decode()

    account.password = base64_password_hashed
    account.password_salt = base64_salt

    print(f"Пароль успешно сброшен для владельца вокспейса '{workspace_id}' (email: {account.email})")

# Сохранение изменений
db.session.commit()
