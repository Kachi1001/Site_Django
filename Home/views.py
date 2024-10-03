from django.shortcuts import render, redirect
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from django.contrib.auth import logout as logout_django
from django.contrib.auth.decorators import login_required
from .models import *

app = __name__.split('.')[0]


def login(request):
    if request.method == "GET":
        logout_django(request)
        return render(request, f'{app}/login.html')
    elif request.method == "POST":
        user = authenticate(username= request.POST.get('nome'), password= request.POST.get('senha'))
        if user:
            login_django(request, user)
            return redirect('/')
        else:
            return render(request, f'{app}/login.html', {"login": request.POST.get('nome')})

@login_required
def index(request):
    return render(request, f"{app}/index.html")

@login_required
def teste(request):
    return render(request, 'teste.html')
