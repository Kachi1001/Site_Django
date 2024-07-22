from django.shortcuts import render
from datetime import datetime
from .models import *
from django.utils import timezone

date = datetime.now()
mes = str(date.month) if date.month >9 else '0'+ str(date.month)
hoje =  str(date.year)+ '-' + mes + '-' + str(date.day)
class reserva:
    def gerarLista(reservados, horarios):
        resultado = []
        for horario in horarios:
            a = reserva(horario, '', '','')
            b = reservados.filter(hora= horario)
            for c in b:
                if c.reservado == 'checked disabled':
                    a = reserva(c.hora,c.reservado,c.responsavel,c.descricao)
            resultado.append(a)
        return(resultado)
    
    def __init__(self, hora, reservado, responsavel, descricao):
        self.hora = hora
        self.reservado = reservado
        self.responsavel = responsavel
        self.descricao = descricao
    
horarios1 = [
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30'
]
horarios2 = [
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30'
]

    
# Create your views here.
def index(request):
    return render(request, "salas/index.html")
def atendimento(request):
    date = request.GET.get('data') if request.GET.get('data') != None else hoje
    reservados = AgendaSalas.objects.all().filter(sala='Atendimento', data=date)
    if request.method == "POST":
        for a in horarios1+horarios2:
            if request.POST.get('check'+a):
                b = AgendaSalas(
                    data=request.POST.get('data-picker'),
                    hora=a,
                    sala='Atendimento',
                    reservado='checked disabled',
                    responsavel=request.POST.get('responsavel'+a),
                    descricao=request.POST.get('descricao'+a),
                )
                b.save()
                date = request.POST.get('data-picker')
                reservados = AgendaSalas.objects.all().filter(sala='Atendimento', data=date)
    context = {
        'data': date,
        'horarios1': reserva.gerarLista(reservados, horarios1),
        'horarios2': reserva.gerarLista(reservados, horarios2),
        'url': 'atendimento',
        'sala': 'Atendimento',
        }
    return render(request, "salas/tabela.html", context)
def reuniao(request):
    date = request.GET.get('data') if request.GET.get('data') != None else hoje
    reservados = AgendaSalas.objects.all().filter(sala='Reuniao', data=date)
    if request.method == "POST":
        for a in horarios1+horarios2:
            if request.POST.get('check'+a):
                b = AgendaSalas(
                    data=request.POST.get('data-picker'),
                    hora=a,
                    sala='Reuniao',
                    reservado='checked disabled',
                    responsavel=request.POST.get('responsavel'+a),
                    descricao=request.POST.get('descricao'+a),
                )
                b.save()
                date = request.POST.get('data-picker')
                reservados = AgendaSalas.objects.all().filter(sala='Reuniao', data=date)
    context = {
        'data': date,
        'horarios1': reserva.gerarLista(reservados, horarios1),
        'horarios2': reserva.gerarLista(reservados, horarios2),
        'url': 'reuniao',
        'sala': 'Reunião',
        }
    return render(request, "salas/tabela.html", context)
def apoio(request):
    date = request.GET.get('data') if request.GET.get('data') != None else hoje
    reservados = AgendaSalas.objects.all().filter(sala='Apoio', data=date)
    if request.method == "POST":
        for a in horarios1+horarios2:
            if request.POST.get('check'+a):
                b = AgendaSalas(
                    data=request.POST.get('data-picker'),
                    hora=a,
                    sala='Apoio',
                    reservado='checked disabled',
                    responsavel=request.POST.get('responsavel'+a),
                    descricao=request.POST.get('descricao'+a),
                )
                b.save()
                date = request.POST.get('data-picker')
                reservados = AgendaSalas.objects.all().filter(sala='Apoio', data=date)
    context = {
        'data': date,
        'horarios1': reserva.gerarLista(reservados, horarios1),
        'horarios2': reserva.gerarLista(reservados, horarios2),
        'url': 'apoio',
        'sala': 'Apoio',
        }
    return render(request, "salas/tabela.html", context)


def lista(request):
    tabela = AgendaSalas.objects.all().order_by('id')
    today = timezone.now().date()
    context = {
        'atendimento': tabela.filter(sala='Atendimento', data__gte=today),
        'apoio': tabela.filter(sala='Apoio', data__gte=today),
        'reuniao': tabela.filter(sala='Reuniao', data__gte=today),
        
        
        'sala': 'Registros',
    }
    return render(request, "salas/lista.html", context)