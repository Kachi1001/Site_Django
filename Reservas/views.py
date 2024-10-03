from django.shortcuts import render, redirect
from .models import *
from Site_django import util
from Site_django.settings import BASE_DIR                                          
app = __name__.split('.')[0]

def gerarLista(reservados, horarios):
    resultado = []
    for horario in horarios:
        a = AgendaSalas(hora=horario,responsavel='',descricao='') #cria um vazio
        b = reservados.filter(hora=horario) #filtro em cima do outro filtro de data para sobra uma linha
        for c in b: #aqui é para evitar erro de ter mais de uma linha, não deveria ter
            if c.reservado == 'checked disabled':
                a = AgendaSalas(hora=c.hora,reservado=c.reservado,responsavel=c.responsavel,descricao=c.descricao)
        resultado.append(a)
    return(resultado)
        
def gerarListaCarros(reservados, listaCarros):
    resultado = []
    for carro in listaCarros:
        a = AgendaCarros(carro=carro,reservado='Disponível',responsavel="",destino="")
        b = reservados.filter(carro=carro)
        for c in b:
            a = AgendaCarros(carro=carro,data=c.data,responsavel=c.responsavel,destino=c.destino,reservado=c.reservado)
        resultado.append(a)
    return(resultado)


horarios1= ["07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30"]
horarios2= ["13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"]
    


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

def carros(request):
    user = request.user
    date = request.GET.get('data') if request.GET.get('data') != None else util.formatarHTML(util.get_hoje())
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
    return render(request, f"{app}/frota/carros.html", context)
def carros_registros(request):
    return None
def munck(request):
    return None
def munck_registros(request):
    return None