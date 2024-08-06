from django.contrib import admin
from django.contrib.auth.models import User
from rolepermissions.admin import RolePermissionsUserAdminMixin
from rolepermissions.roles import get_user_roles, assign_role, remove_role

class CustomUserAdmin(RolePermissionsUserAdminMixin, admin.ModelAdmin):
    list_display = ('username', 'email', 'get_roles')
    actions = ['assign_admin_role', 'remove_admin_role']

    def get_roles(self, obj):
        return ", ".join([role.role_name for role in get_user_roles(obj)])
    get_roles.short_description = 'Roles'

    def assign_admin_role(self, request, queryset):
        for user in queryset:
            assign_role(user, 'admin')
        self.message_user(request, "Admin role assigned successfully")

    def remove_admin_role(self, request, queryset):
        for user in queryset:
            remove_role(user, 'admin')
        self.message_user(request, "Admin role removed successfully")

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
