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
def cadastros(request, resource):
    return render(request, f"{app}/cadastros/{resource}.html", {'resource': resource}) 

@login_required
@has_permission_decorator(app)
def tabelas(request, resource):
    try:
        return render(request, f"{app}/tabelas/{resource}.html", {'table_height': '600','resource':resource})
    except:
        return render(request, f"{app}/tabelas/generic.html", {'table_height': '600','resource':resource})
        

@login_required
@has_permission_decorator(app)
def consultas(request, resource):
    try:
        return render(request, f"{app}/consultas/{resource}.html", {'table_height': '600','resource':resource})
    except:
        return render(request, f"{app}/consultas/generic.html", {'table_height': '600','resource':resource})

@login_required
@has_permission_decorator(app)
def lancamentos(request, resource):
    return render(request, f"{app}/lancamentos/{resource}.html", {'resource': resource})

@login_required
@has_permission_decorator(app)
def graficos(request, resource):
    return render(request, f"{app}/graficos/{resource}.html", {'resource': resource})

@login_required
@has_permission_decorator(app+'-menu')
def app_menu(request):
    return render(request, f"{app}/app.html")