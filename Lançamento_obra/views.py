from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404
from .models import *   
from django.contrib.auth.decorators import login_required
from rolepermissions.decorators import has_role_decorator
from PIL import Image
import os
from pathlib import Path  
from django.conf import settings
import datetime
from django.core.paginator import Paginator
urllogin = "/login"

@login_required(login_url=urllogin)
def index(request):
    return render(request, "lancamento_obra/index.html")

@login_required(login_url=urllogin)
@has_role_decorator('lancamento_obra')
def cadastro_colab(request):
    if request.method == "POST":
        # adicionar codigo para poup-up e verificação de dados
        colab = Colaborador(
            nome=request.POST.get("nome"),
            funcao=Funcao(request.POST.get("funcao")),
            admissao=request.POST.get("admissao"),
            demissao=request.POST.get("demissao"),
            contrato=Tipocontrato(request.POST.get("tipo")),
            diaria=request.POST.get("diaria"),
            observacoes=request.POST.get("observacao"),
            encarregado=request.POST.get("encarregado"),
        )
        colab.save()
    return render(request, "lancamento_obra/cadastro/colaborador.html", {
        'func_list': Funcao.objects.all(),
        'data': Colaborador.objects.all().order_by('-admissao')[:10],
        }
    ) 

@login_required(login_url=urllogin)
def cadastro_funcao(request):
    if request.method == "GET":
        return render(request, "lancamento_obra/cadastro/funcao.html")
    elif request.method == "POST":
        func = Funcao(funcao=request.POST.get('nome'),grupo="2")
        func.save()
        return render(request, "lancamento_obra/cadastro/funcao.html")
        

@login_required(login_url=urllogin)
def cadastro_obra(request):
    if request.method == "GET":
        return render(request, "lancamento_obra/cadastro/obra.html", {"super_list": Supervisor.objects.all()})
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
        return render(request, "lancamento_obra/cadastro/obra.html", {"super_list": Supervisor.objects.all()})




@login_required(login_url=urllogin)
def visualizacao_colab(request):
    data = Colaborador.objects.all()
    
    data_paginator = Paginator(data, 15)
    page_num = request.GET.get('page')
    data_page = data_paginator.get_page(page_num)
    
    return render(request, "lancamento_obra/visualizacao/colaborador.html", {'data': data_page})

@login_required(login_url=urllogin)
def visualizacao_obra(request):
    data = Obra.objects.all()
    data_paginator = Paginator(data, 10)
    page_num = request.GET.get('page')
    data_page = data_paginator.get_page(page_num)
    return render(request, "lancamento_obra/visualizacao/obra.html", {'data': data_page})

@login_required(login_url=urllogin)
def visualizacao_atividade(request):
    data = Lancamentos.objects.all().order_by('-id')
    data_paginator = Paginator(data, 10)
    page_num = request.GET.get('page')
    data_page = data_paginator.get_page(page_num)
    return render(request, "lancamento_obra/visualizacao/atividade.html", {'data': data_page})

@login_required(login_url=urllogin)
def visualizacao_diario(request):
    data = Diarioobra.objects.all().order_by('-id')
    data_paginator = Paginator(data, 10)
    page_num = request.GET.get('page')
    data_page = data_paginator.get_page(page_num)
    return render(request, "lancamento_obra/visualizacao/diario.html", {'data': data_page})

@login_required(login_url=urllogin)
def visualizacao_hora_horaextra(request):
    data = ResumoJunta.objects.all()
    data_paginator = Paginator(data, 15)
    page_num = request.GET.get('page')
    data_page = data_paginator.get_page(page_num)
    return render(request, "lancamento_obra/visualizacao/hora_horaextra.html", {'data': data_page})

@login_required(login_url=urllogin)
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
                digito=request.POST.get("digito"),
                etapa1=0,
                etapa2=0,
                etapa3=0,
                perdevale=True,
                revisaorh="",
                diario= "_".join([request.POST.get("obra"), data, request.POST.get("digito")])
            )
        att.save() 
        return redirect(lancamento_atividade)
    
@login_required(login_url=urllogin)
def lancamento_diario(request):
    if request.method == "GET":    
        return render(request, "lancamento_obra/lancamento/diario.html", {'obras_list': Obra.objects.all(), "colab_list": Colaborador.objects.all()})
    elif request.method == "POST":
        digitalizacao = request.FILES.get('arquivo')
        img = Image.open(digitalizacao)
        path = os.path.join(settings.BASE_DIR, f'midia/Lançamento_obra/diarios_digitalizado/{digitalizacao.name}')
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

@login_required(login_url=urllogin)
def pesquisa_home(request):
    return render(request, "lancamento_obra/pesquisa/home.html")

@login_required(login_url=urllogin)
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

@login_required(login_url=urllogin)
def pesquisa_historico_obra(request):
    dado = None
    select = ""
    id = request.GET.get("id")
    if id != None:
        select = Obra.objects.get(cr=id)
        dado = Lancamentos.objects.filter(obra=select).order_by("-id")
        
    return render(request, "lancamento_obra/pesquisa/historico_obra.html", {
        'info': Obra.objects.all(),
        'dado': dado,
        'select': select,
        })
    
@login_required(login_url=urllogin)
def pesquisa_atividade_diario(request):
    dado = None
    select = ""
    id = request.GET.get("id")
    if id != None:
        select = Diarioobra.objects.get(id=id).id
        dado = Lancamentos.objects.filter(diario=select).order_by("-id")
        
    return render(request, "lancamento_obra/pesquisa/atividade_diario.html", {
        'info': Diarioobra.objects.all(),
        'dado': dado,
        'select': select,
        })