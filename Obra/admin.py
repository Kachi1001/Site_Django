from django.contrib import admin
from django.contrib.auth.models import User
from rolepermissions.admin import RolePermissionsUserAdminMixin
from rolepermissions.roles import get_user_roles, assign_role, remove_role
