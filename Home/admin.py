from django.contrib import admin
from .models import Pendencia

class PendenciaAdmin(admin.ModelAdmin):
    list_display = ('name_user',)  # Corrigido com uma vírgula para tornar uma tupla válida
    
    def name_user(self, obj):
        return f'{obj.user.username}'
    name_user.short_description = 'Usuário'

admin.site.register(Pendencia, PendenciaAdmin)

from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from rolepermissions.admin import RolePermissionsUserAdminMixin
from rolepermissions.roles import get_user_roles, assign_role, remove_role

class CustomUserAdmin(UserAdmin, RolePermissionsUserAdminMixin, admin.ModelAdmin):
    list_display = ('id','username', 'get_roles', 'last_login')
    # actions = ['assign_admin_role', 'remove_admin_role']

    def get_roles(self, obj):
        return ", ".join([role.role_name for role in get_user_roles(obj)]) # type: ignore
    get_roles.short_description = 'Roles'

    # def assign_admin_role(self, request, queryset):
    #     for user in queryset:
    #         assign_role(user, 'admin')
    #     self.message_user(request, "Admin role assigned successfully")

    # def remove_admin_role(self, request, queryset):
    #     for user in queryset:
    #         remove_role(user, 'admin')
    #     self.message_user(request, "Admin role removed successfully")

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
