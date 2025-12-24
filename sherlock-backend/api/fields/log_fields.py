from flask_restx import fields

from libs.helper import TimestampFieldUTC5

login_log_fields = {
    "id": fields.String,
    "account_id": fields.String,
    "ip_address": fields.String,
    "user_agent": fields.String,
    "created_at": TimestampFieldUTC5,
    "is_successful": fields.Boolean,
}

login_log_list_fields = {
    "logs": fields.List(fields.Nested(login_log_fields)),
}

