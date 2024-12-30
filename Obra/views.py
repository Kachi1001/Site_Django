from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rolepermissions.decorators import has_permission_decorator

app = __name__.split('.')[0]
@login_required
@has_permission_decorator(app)
def index(request):
    return render(request, f"{app}/index.html")

@login_required
@has_permission_decorator(app+'-cadastros')
def cadastros(request, resource):
    return render(request, f"{app}/cadastros/{resource}.html", {'resource':resource}) 

@login_required
@has_permission_decorator(f'{app}-tabelas')
def tabelas(request, resource):
    return render(request, f"{app}/tabelas/{resource}.html", {'table_height': '600','resource':resource})

@login_required
@has_permission_decorator(f'{app}-consultas')
def consultas(request, resource):
    
    return render(request, f"{app}/consultas/{resource}.html",{'table_height': '600','resource':resource}) 

@login_required
@has_permission_decorator(f'{app}-lancamentos')
def lancamentos(request, resource):
    return render(request, f"{app}/lancamentos/{resource}.html", {'resource':resource})

@login_required
@has_permission_decorator(f'{app}-graficos')
def graficos(request, resource):
    return render(request, f"{app}/grafico/{resource}.html",{'resource':resource})