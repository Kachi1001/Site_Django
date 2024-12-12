from django.contrib import admin
from .models import Pendencia

class PendenciaAdmin(admin.ModelAdmin):
    list_display = ('name_user',)  # Corrigido com uma vírgula para tornar uma tupla válida
    
    def name_user(self, obj):
        return f'{obj.user.username}'
    name_user.short_description = 'Usuário'

admin.site.register(Pendencia, PendenciaAdmin)
