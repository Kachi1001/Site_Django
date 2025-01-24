from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rolepermissions.decorators import has_permission_decorator

from .models import *
app = __name__.split('.')[0]

# Create your views here.
def index(request):
    return render(request, f'{app}/index.html')

def maquina(request, subpage):
    return render(request, f'{app}/maquina/{subpage}.html')

def colaborador(request, subpage):
    return render(request, f'{app}/colaborador/{subpage}.html')

def estoque(request, subpage):
    return render(request, f'{app}/estoque/{subpage}.html')

def servicos(request, subpage):
    return render(request, f'{app}/servicos/{subpage}.html')

def app_menu(request):
    return render(request, f'{app}/app.html')

@login_required
@has_permission_decorator(f'{app}-graficos')
def graficos(request, resource):
    return render(request, f"{app}/graficos/{resource}.html",{'resource':resource})