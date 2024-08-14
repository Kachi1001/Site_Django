from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404
from .models import * 
from django.contrib.auth.decorators import login_required
from PIL import Image
import os
from pathlib import Path  
from django.conf import settings
import datetime
from django.core.paginator import Paginator
from django.contrib.auth.models import User


@login_required
def index(request):
    return render(request, "lancamento_obra/index.html",)

@login_required
def cadastro_colab(request):
    return render(request, "lancamento_obra/cadastro/colaborador.html", {
        'func_list': Funcao.objects.all(),
        'data': Colaborador.objects.all().order_by('-id')[:10],
        'nome': request.user.username,
        }
    ) 

@login_required
def cadastro_outros(request):
    return render(request, "lancamento_obra/cadastro/outros.html", {
        "nome": request.user.username,
        'funcao': Funcao.objects.all(),
        'supervisor': Supervisor.objects.all(),
        })
        

@login_required
def cadastro_obra(request):
    if request.method == "GET":
        return render(request, "lancamento_obra/cadastro/obra.html", {
            "super_list": Supervisor.objects.all(),
            'data': Obra.objects.all().order_by('-cr')[:7]
            })
    elif request.method == "POST":
        obra = Obra(
                cr=request.POST.get("cr"),
                orcamento=request.POST.get("orcamento"),
                retrabalho=request.POST.get("retrabalho"),
                empresa=request.POST.get("empresa"),
                cidade=request.POST.get("cidade"),
                descricao=request.POST.get("descricao"),
                supervisor=Supervisor(request.POST.get("supervisor"),ativo= True),
                finalizada=False,
                indice=request.POST.get("indice"),
            )
        obra.save()
        return redirect(cadastro_obra)


def visu_tabela(request, data, html):
    data_paginator = Paginator(data, 10)
    page_num = request.GET.get('page')
    data_page = data_paginator.get_page(page_num)
    
    return render(request, f"lancamento_obra/visualizacao/{html}.html", {'data': data_page})

@login_required
def visualizacao_colab(request):
    return visu_tabela(request, Colaborador.objects.all().order_by('-id'), 'colaborador')

@login_required
def visualizacao_obra(request):
    return visu_tabela(request, Obra.objects.all().order_by('-cr'), 'obra')
    
@login_required
def visualizacao_atividade(request):
    return visu_tabela(request, Lancamentos.objects.all().order_by('-id'), 'atividade')
    
@login_required
def visualizacao_diario(request):
    return visu_tabela(request, Diarioobra.objects.all().order_by('-id'), 'diario')

@login_required
def visualizacao_hora_horaextra(request):
    return visu_tabela(request, ResumoJunta.objects.all(), 'hora_horaextra')

@login_required
def lancamento_atividade(request):
    if request.method == "GET":
        return render (request, "lancamento_obra/lancamento/atividade.html", {
            'obras_list': Obra.objects.all(), 
            'colab_list': Colaborador.objects.all(),
            'att_list': Atividade.objects.all(),
            'data': Lancamentos.objects.all().order_by('-id')[:7],
            }
        )
    elif request.method == "POST":
        hora = [None] * 6
        b = 0
        for a in [request.POST.get("horaini1"),request.POST.get("horafim1"),request.POST.get("horaini2"),request.POST.get("horafim2"),request.POST.get("horaini3"),request.POST.get("horafim3")]:
            if a != "":
                hora[b] = a
            b = b + 1
        data = request.POST.get("dia").split("-")
        data = str(int(data[2])) + "-" + str(int(data[1])) + "-" + data[0]
        diario = str(request.POST.get('obra')) + "_" + data + "_" + str(request.POST.get('indice'))
        att = Lancamentos(
                obra=Obra(request.POST.get("obra")),
                colaborador=request.POST.get("colaborador"),
                dia=request.POST.get("dia"),
                descricao=request.POST.get("descricao"),
                horaini1=hora[0],   
                horafim1=hora[1],
                horaini2=hora[2],
                horafim2=hora[3],
                horaini3=hora[4],
                horafim3=hora[5],
                atividade=Atividade(request.POST.get("atividade")),
                diaseguinte=True,
                indice=request.POST.get("indice"),
            )
        att.save() 
        return redirect(lancamento_atividade)
    
@login_required
def lancamento_diario(request):
    if request.method == "GET":    
        return render(request, "lancamento_obra/lancamento/diario.html", {
            'obras_list': Obra.objects.all(), 
            "colab_list": Colaborador.objects.all(),
            'data': Diarioobra.objects.all().order_by('-id')[:5],
            })
    elif request.method == "POST":
        digitalizacao = request.FILES.get('arquivo')
        img = Image.open(digitalizacao)
        path = os.path.join(settings.BASE_DIR, f'media/Lancamento_obra/diarios_digitalizado/{digitalizacao.name}')
        img = img.save(path)   
        
        diaria = Diarioobra(
            obra = request.POST.get("obra"),
            data= request.POST.get("data"),
            id= digitalizacao.name.split(".")[0],
            encarregado= request.POST.get("encarregado"),
            climamanha= request.POST.get("climamanha"),
            climatarde= request.POST.get("climatarde"),
            imagem= digitalizacao.name
        ) 
        diaria.save()
        return redirect("lancamento_diario")

@login_required
def pesquisa_historico_colab(request):
    dado = None
    colab = ""
    if request.GET.get("id") != None:
        colab = Colaborador.objects.get(id=request.GET.get("id")).nome
        dado = Lancamentos.objects.filter(colaborador=colab).order_by("-id")
        
    return render(request, "lancamento_obra/pesquisa/historico_colab.html", {
        'colab': Colaborador.objects.all(),
        'data': dado,
        'select': colab,
        })

@login_required
def pesquisa_historico_obra(request):
    dado = None
    select = ""
    id = request.GET.get("id")
    if id != None:
        select = Obra.objects.get(cr=id)
        dado = Lancamentos.objects.filter(obra=select).order_by("-id")
        
    return render(request, "lancamento_obra/pesquisa/historico_obra.html", {
        'info': Obra.objects.all(),
        'data': dado,
        'select': select,
        })
    
@login_required
def pesquisa_atividade_diario(request):
    dado = None
    select = ""
    id = request.GET.get("id")
    if id != None:
        select = Diarioobra.objects.get(id=id).id
        dado = Lancamentos.objects.filter(diario=select).order_by("-id")
        
    return render(request, "lancamento_obra/pesquisa/atividade_diario.html", {
        'info': Diarioobra.objects.all(),
        'data': dado,
        'select': select,
        })