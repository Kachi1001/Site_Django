from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rolepermissions.decorators import has_role_decorator
from rolepermissions.decorators import has_permission_decorator

@login_required
@has_permission_decorator('lancamento_obra')
def index(request):
    return render(request, "lancamento_obra/index.html",)


@login_required
@has_permission_decorator('lancamento_obra-cadastros')
def cadastros(request, type):
    return render(request, f"lancamento_obra/cadastros/{type}.html", {'table': type}) 

@login_required
@has_permission_decorator('lancamento_obra-tabelas')
def tabelas(request, table):
    return render(request, f"lancamento_obra/tabelas/{table}.html", {'table_height': '600','table':table}) 

@login_required
@has_permission_decorator('lancamento_obra-consultas')
def consultas(request, table):
    return render(request, f"lancamento_obra/consultas/{table}.html", {'table_height': '600','table':table}) 

@login_required
@has_permission_decorator('lancamento_obra-lancamentos')
def lancamentos(request, type):
    return render(request, f"lancamento_obra/lancamentos/{type}.html", {'table': type})