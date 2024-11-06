from django.shortcuts import render, redirect
from .models import *
from Site_django import util
from Site_django.settings import BASE_DIR                                          
app = __name__.split('.')[0]

def index(request):
    return render(request, f"{app}/index.html",)

def sala_registros(request):
    tabela = AgendaSalas.objects.all().order_by('data','hora')
    context = {
        'atendimento': tabela.filter(sala='atendimento', data__gte=util.get_hoje())[:50],
        'apoio': tabela.filter(sala='apoio', data__gte=util.get_hoje())[:50],
        'reuniao': tabela.filter(sala='reunião', data__gte=util.get_hoje())[:50],
        'auxiliar': tabela.filter(sala='auxiliar', data__gte=util.get_hoje())[:50],
        'sala': 'Registros',
    }
    return render(request, f"{app}/salas/registros.html",context)


def sala(request, sala):
    return render(request, f"{app}/salas/sala.html", {'sala':sala})
