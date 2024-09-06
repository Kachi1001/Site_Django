from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def index(request):
    return render(request, "lancamento_obra/index.html",)

@login_required
def cadastro(request, type):
    return render(request, f"lancamento_obra/cadastro/{type}.html", {'table': type}) 

@login_required
def visualizacao(request, table):
    return render(request, f"lancamento_obra/visualizacao/{table}.html", {'table_height': '600','table':table}) 

@login_required # type: ignore
def lancamento(request, type):
    return render(request, f"lancamento_obra/lancamento/{type}.html", {'table': type})