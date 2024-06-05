from django.shortcuts import render
from django.http import HttpResponse
from .models import colaborador

def index(request):
    return render(request, "lancamento_obra/index.html")

def cadastro_colab(request):
    if request.method == "GET":
        return render(request, "lancamento_obra/cadastro/colaborador.html")
    elif request.method == "POST":
        nome = request.POST.get("nome")
        funçao = request.POST.get("funçao")
        admissao = request.POST.get("admissao")
        demissao = request.POST.get("demissao")
        tipo = request.POST.get("tipo")
        diaria = request.POST.get("diaria")
        observacao = request.POST.get("observacao")
        
        colab = colaborador(
            nome=nome,
            funçao=funçao,
            admissao=admissao,
            demissao=demissao,
            tipo=tipo,
            diaria=diaria,
            observacao=observacao,
        )
        
        colab.save()
        return render(request, "lancamento_obra/cadastro/colaborador.html")