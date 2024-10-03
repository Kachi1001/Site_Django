from django.shortcuts import render
from .models import *
app = __name__.split('.')[0]

# Create your views here.
def index(request):
    return render(request, f'{app}/index.html')

def maquina(request, subpage):
    return render(request, f'ti/maquina/{subpage}.html')

def colaborador(request, subpage):
    return render(request, f'ti/colaborador/{subpage}.html')

def estoque(request, subpage):
    return render(request, f'ti/estoque/{subpage}.html')

def servicos(request, subpage):
    return render(request, f'ti/servicos/{subpage}.html')

