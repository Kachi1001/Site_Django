from django.shortcuts import render, redirect
import json
import os
from .models import *
from django.utils import timezone
from Site_Django.util import *
from Site_Django.settings import BASE_DIR 

class reserva:
    def gerarLista(reservados, horarios):
        resultado = []
        for horario in horarios:
            a = reserva(horario, '', '','') #cria um vazio
            b = reservados.filter(hora= horario) #filtro em cima do outro filtro de data para sobra uma linha
            for c in b: #aqui é para evitar erro de ter mais de uma linha, não deveria ter
                if c.reservado == 'checked disabled':
                    a = reserva(c.hora,c.reservado,c.responsavel,c.descricao)
            resultado.append(a)
        return(resultado)
    
    def __init__(self, hora, reservado, responsavel, descricao):
        self.hora = hora
        self.reservado = reservado
        self.responsavel = responsavel
        self.descricao = descricao                                              
        
def gerarListaCarros(reservados, listaCarros):
    resultado = []
    for carro in listaCarros:
        a = AgendaCarros(carro=carro,reservado='Disponível',responsavel="",destino="")
        b = reservados.filter(carro=carro)
        for c in b:
            a = AgendaCarros(carro=carro,data=c.data,responsavel=c.responsavel,destino=c.destino,reservado=c.reservado)
        resultado.append(a)
    return(resultado)
    
def autoResp(request, user, a):
    if request.POST.get('responsavel'+a) == "" and user.is_authenticated and (request.POST.get('check'+a) or request.POST.get('descricao'+a)):
        return user.username
    elif request.POST.get('responsavel'+a):
        return request.POST.get('responsavel'+a)
    else:
        return False

horarios1= ["07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30"]
horarios2= ["13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"]
    




def index(request):
    return render(request, "reservas/index.html")

def sala_registros(request):
    tabela = AgendaSalas.objects.all().order_by('data','hora')
    today = timezone.now().date()
    context = {
        'atendimento': tabela.filter(sala='atendimento', data__gte=today),
        'apoio': tabela.filter(sala='apoio', data__gte=today),
        'reuniao': tabela.filter(sala='reunião', data__gte=today),
        'sala': 'Registros',
    }
    return render(request, "reservas/salas/registros.html", context)


def sala(request, sala):
    user = request.user
    hoje = timezone.now().date()
    date = request.GET.get('data') if request.GET.get('data') != None else tempo.formatarHTML(hoje)
    if request.method == "POST":
        for a in horarios1+horarios2:
            responsavel = autoResp(request,user,a)
            if responsavel:
                b = AgendaSalas(
                    data=request.POST.get('data-picker'),
                    hora=a,
                    sala=sala,
                    reservado='checked disabled',
                    responsavel=responsavel,
                    descricao=request.POST.get('descricao'+a),
                )
                b.save()
        date = request.POST.get('data-picker')
        return redirect(f'/reservas/sala/{sala}?data={date}')
    reservados = AgendaSalas.objects.using('Reservas').all().filter(sala=sala, data=date)
    context = {
        'data': date,   
        'horarios1': reserva.gerarLista(reservados, horarios1),
        'horarios2': reserva.gerarLista(reservados, horarios2),
        'sala': sala,
        }
    return render(request, "reservas/salas/sala.html", context)

def carros(request):
    user = request.user
    hoje = timezone.now().date()
    date = request.GET.get('data') if request.GET.get('data') != None else tempo.formatarHTML(hoje)
    if request.method == "POST":
        if not request.POST.get('responsavel') and user.is_authenticated:
            responsavel = user.username
        elif request.POST.get('responsavel'):
            responsavel = request.POST.get('responsavel')
        else:
            responsavel = False
            
        if responsavel:
            b = AgendaCarros(carro=Carros.objects.get(placa=request.POST.get('placa')),data=request.POST.get('data-picker'),responsavel=responsavel,destino=request.POST.get('destino'),reservado='Reservado')
            b.save()
        date = request.POST.get('data-picker')
        return redirect(f'/reservas/frota/carros?data={date}')
    reservados = AgendaCarros.objects.all().filter(data=date)
    context = {
        'data': date,   
        'dados': gerarListaCarros(reservados, Carros.objects.all()),
        }
    return render(request, "reservas/frota/carros.html", context)
def carros_registros(request):
    return None
def munck(request):
    return None
def munck_registros(request):
    return None