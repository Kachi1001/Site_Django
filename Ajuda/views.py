from turtle import mode
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from . import models
app = __name__.split('.')[0]

@login_required
def index(request):
    return render(request, f"{app}/index.html")

@login_required
def menus(request, resource):
    data = []
    for row in models.Menu.objects.all().filter(app = resource).values():
        data.append({'nome': row['nome'], 'submenu':models.Submnenu.objects.all().filter(menu = row['id']).values()})
    return render(request, f"{app}/menus.html", {'resource': resource, 'data':data})
