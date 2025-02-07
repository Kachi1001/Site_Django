from django.contrib import admin
from .models import *

class PendenciaAdmin(admin.ModelAdmin):
    list_display = ('name_user','password_change')  # Corrigido com uma vírgula para tornar uma tupla válida
    
    def name_user(self, obj):
        return f'{obj.user.username}'
    name_user.short_description = 'Usuário'
admin.site.register(Pendencia, PendenciaAdmin)

class LogAdmin(admin.ModelAdmin):
    list_display = ('id','user_name', 'action','resource','app','date','status')  # Corrigido com uma vírgula para tornar uma tupla válida
    search_fields = ['id','text']
    actions = None
    list_filter = ['user_name', 'action','resource','app','date','status']
    
    def name_user(self, obj):
        return f'{obj.user_name}'
    name_user.short_description = 'Usuário'
admin.site.register(Log, LogAdmin)

class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('username','endpoint','method','timestamp','status_code','server','version')  # Corrigido com uma vírgula para tornar uma tupla válida
    search_fields = ['id','username']
    actions = None
    list_filter = ['username','timestamp','status_code','server','version','method']
    
    def name_user(self, obj):
        return f'{obj.user_name}'
    name_user.short_description = 'Usuário'

admin.site.register(LogEntry, LogEntryAdmin)

from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from rolepermissions.admin import RolePermissionsUserAdminMixin
from rolepermissions.roles import get_user_roles, assign_role, remove_role

class CustomUserAdmin(UserAdmin, RolePermissionsUserAdminMixin, admin.ModelAdmin):
    list_display = ('id','username', 'get_roles', 'last_login')

    def get_roles(self, obj):
        return ", ".join([role.role_name for role in get_user_roles(obj)]) # type: ignore
    get_roles.short_description = 'Roles'

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
