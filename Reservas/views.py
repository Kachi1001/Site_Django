from django.shortcuts import render, redirect

from .models import *
from django.utils import timezone
from Site_Django.util import *
hoje = timezone.now().date()

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
    user = request.user
    sala = 'atendimento'
    date = request.GET.get('data') if request.GET.get('data') != None else tempo.formatarHTML(hoje)
    if request.method == "POST":
        for a in horarios1+horarios2:
            if request.POST.get('responsavel'+a) == "" and user.is_authenticated and (request.POST.get('check'+a) or request.POST.get('descricao'+a)):
                responsavel = user.username
            elif request.POST.get('responsavel'+a):
                responsavel = request.POST.get('responsavel'+a)
            else:
                responsavel = False
                
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
        return redirect(f'/salas/{sala}?data={date}')
    reservados = AgendaSalas.objects.using('Reservas').all().filter(sala=sala, data=date)
    context = {
        'data': date,
        'horarios1': reserva.gerarLista(reservados, horarios1),
        'horarios2': reserva.gerarLista(reservados, horarios2),
        'sala': sala,
        }
    return render(request, "salas/tabela.html", context)

def reuniao(request):
    user = request.user
    sala = 'reunião'
    date = request.GET.get('data') if request.GET.get('data') != None else tempo.formatarHTML(hoje)
    if request.method == "POST":
        for a in horarios1+horarios2:
            if request.POST.get('responsavel'+a) == "" and user.is_authenticated and (request.POST.get('check'+a) or request.POST.get('descricao'+a)):
                responsavel = user.username
            elif request.POST.get('responsavel'+a):
                responsavel = request.POST.get('responsavel'+a)
            else:
                responsavel = False
    
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
        return redirect(f'/salas/{sala}?data={date}')
        
    reservados = AgendaSalas.objects.all().filter(sala=sala, data=date)
    context = {
        'data': date,
        'horarios1': reserva.gerarLista(reservados, horarios1),
        'horarios2': reserva.gerarLista(reservados, horarios2),
        'sala': sala,
        }
    return render(request, "salas/tabela.html", context)


            
def apoio(request):
    user = request.user
    sala = 'apoio'
    date = request.GET.get('data') if request.GET.get('data') != None else tempo.formatarHTML(hoje)
    if request.method == "POST":
        for a in horarios1+horarios2:
            if request.POST.get('responsavel'+a) == "" and user.is_authenticated and (request.POST.get('check'+a) or request.POST.get('descricao'+a)):
                responsavel = user.username
            elif request.POST.get('responsavel'+a):
                responsavel = request.POST.get('responsavel'+a)
            else:
                responsavel = False
    
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
        return redirect(f'/salas/{sala}?data={date}')
    reservados = AgendaSalas.objects.all().filter(sala=sala, data=date)
    context = {
        'data': date,
        'horarios1': reserva.gerarLista(reservados, horarios1),
        'horarios2': reserva.gerarLista(reservados, horarios2),
        'sala': sala,
        }
    return render(request, "salas/tabela.html", context)


def lista(request):
    tabela = AgendaSalas.objects.all().order_by('data','hora')
    today = timezone.now().date()
    context = {
        'atendimento': tabela.filter(sala='atendimento', data__gte=today),
        'apoio': tabela.filter(sala='apoio', data__gte=today),
        'reuniao': tabela.filter(sala='reunião', data__gte=today),
        'sala': 'Registros',
    }
    return render(request, "salas/lista.html", context)