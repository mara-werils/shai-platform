import base64
import secrets

from extensions.ext_database import db
from libs.password import hash_password
from models.account import Account

emails = [
    "mmm@gmail.com",
    "ikmake9@gmail.com",
]

new_password = 'NewPassword123'

for email in emails:

    account = db.session.query(Account).filter(Account.email == email).first()
    if not account:
        print("account '{}' not found".format(email))
        continue

    salt = secrets.token_bytes(16)
    base64_salt = base64.b64encode(salt).decode()

    password_hashed = hash_password(new_password, salt)
    base64_password_hashed = base64.b64encode(password_hashed).decode()

    account.password = base64_password_hashed
    account.password_salt = base64_salt

    print(f"Пароль успешно сброшен для  (email: {account.email})")

# Сохранение изменений
db.session.commit()
