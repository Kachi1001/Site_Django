from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Lancamentos)
admin.site.register(Obra)
admin.site.register(Diarioobra)
