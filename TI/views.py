from django.shortcuts import render
from Home.models import *

# Create your views here.
def index(request):
    return render(request, 'ti/index.html')

def equipamentos(request, subpage):
    return render(request, f'ti/equipamentos/{subpage}.html')

def colaborador(request, subpage):
    return render(request, f'ti/colaborador/{subpage}.html')

def estoque(request, subpage):
    return render(request, f'ti/estoque/{subpage}.html')

