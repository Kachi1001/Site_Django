from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rolepermissions.decorators import has_permission_decorator

app = __name__.split('.')[0]

@login_required
@has_permission_decorator(app)
def index(request):
    return render(request, f"{app}/index.html")

@login_required
@has_permission_decorator(app)
def cadastros(request, type):
    return render(request, f"{app}/cadastros/{type}.html", {'table': type}) 

@login_required
@has_permission_decorator(app)
def tabelas(request, table):
    return render(request, f"{app}/tabelas/{table}.html", {'table_height': '600','table':table})

@login_required
@has_permission_decorator(app)
def consultas(request, table):
    
    return render(request, f"{app}/consultas/{table}.html", {'table_height': '600','table':table}) 

@login_required
@has_permission_decorator(app)
def lancamentos(request, type):
    return render(request, f"{app}/lancamentos/{type}.html", {'table': type})

@login_required
@has_permission_decorator(app)
def graficos(request, type):
    return render(request, f"{app}/grafico/{type}.html", {'table': type})