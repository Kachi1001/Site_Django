from django.shortcuts import render
from django.http import HttpResponse, Http404
from .models import *   
from django.contrib.auth.decorators import login_required
urllogin = "/login"

@login_required(login_url=urllogin)
def index(request):
    return render(request, "lancamento_obra/index.html")

@login_required(login_url=urllogin)
def cadastro_colab(request):
    if request.method == "GET":
        return render(request, "lancamento_obra/cadastro/colaborador.html", {"func_list": Funcao.objects.all()})
    elif request.method == "POST":
        # adicionar codigo para poup-up e verificação de dados
        colab = Colaborador(
            nome=request.POST.get("nome"),
            funcao=Funcao(request.POST.get("funcao")),
            admissao=request.POST.get("admissao"),
            demissao=request.POST.get("demissao"),
            contrato=Tipocontrato(request.POST.get("tipo")),
            diaria=request.POST.get("diaria"),
            observacoes=request.POST.get("observacao"),
        )
        colab.save()
        return render(request, "lancamento_obra/cadastro/colaborador.html", {"func_list": Funcao.objects.all()}) 

# @login_required(login_url=urllogin)
def cadastro_funcao(request):
    if request.method == "GET":
        return render(request, "lancamento_obra/cadastro/funcao.html")
    elif request.method == "POST":
        nome = request.POST.get("nome")
        func = Funcao(funcao=nome)
        func.save()
        return render(request, "lancamento_obra/cadastro/funcao.html" )

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
    colab_list = Colaborador.objects.all()
    return render(request, "lancamento_obra/visualizacao/colaborador.html", {'colab_list': colab_list})

@login_required(login_url=urllogin)
def visualizacao_obra(request):
    obras_list = Obra.objects.all()
    return render(request, "lancamento_obra/visualizacao/obra.html", {'obras_list': obras_list})

@login_required(login_url=urllogin)
def visualizacao_atividade(request):
    atividades_list = Lancamentos.objects.all()
    return render(request, "lancamento_obra/visualizacao/atividade.html", {'atividades_list': atividades_list})

@login_required(login_url=urllogin)
def lancamento_atividade(request):
    if request.method == "GET":
        return render (request, "lancamento_obra/lancamento/atividade.html", {
            'obras_list': Obra.objects.all(), 
            'colab_list': Colaborador.objects.all(),
            'att_list': Atividade.objects.all()
            }
        )
    elif request.method == "POST":
        hora = [None] * 6
        b = 0
        for a in [request.POST.get("horaini1"),request.POST.get("horafim1"),request.POST.get("horaini2"),request.POST.get("horafim2"),request.POST.get("horaini3"),request.POST.get("horafim3")]:
            if a != "":
                hora[b] = a
            b = b + 1
        att = Lancamentos(
                obra=Obra(request.POST.get("obra")),
                colaborador=Colaborador(request.POST.get("colaborador")),
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
                digito=1,
                etapa1=1,
                etapa2=1,
                etapa3=1,
                perdevale=True,
                revisaorh="",
            )
        att.save() 
        return render (request, "lancamento_obra/lancamento/atividade.html", {
            'obras_list': Obra.objects.all(), 
            'colab_list': Colaborador.objects.all(),
            'att_list': Atividade.objects.all()
            }
        )