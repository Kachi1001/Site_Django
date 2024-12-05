from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as login_django, logout as logout_django
from django.contrib.auth.decorators import login_required
from .models import *

import requests
from decouple import config

app = __name__.split('.')[0]


def login(request):
    if request.method == "GET":
        logout_django(request)
        return render(request, f'{app}/login.html', {'next':request.GET.get('next', '/')})
    elif request.method == "POST":
        username = request.POST['nome']
        password = request.POST['senha']
        user = authenticate(username= username, password=password)
        if user:
            login_django(request, user)
            api_url = f"{config('API')}token"
            api_response = requests.post(api_url, json={
                'username': username,
                'password': password
            })
            if api_response.status_code == 200:
                token = api_response.json().get('access')
                request.session['api_token'] = token  # Salva o token na sessão
                return redirect(request.POST.get('next', '/'))
            else:
                return render(request, f'{app}/login.html', {
                    "login": username,
                    "error": "Erro ao autenticar na API externa.",
                    "next": request.GET.get('next', '/')
                })
        else:
            return render(request, f'{app}/login.html', {"login": request.POST.get('nome'), 'next':request.GET.get('next', '/')})

@login_required
def index(request):
    return render(request, f"{app}/index.html")

@login_required
def teste(request):
    return render(request, 'teste.html')


from django.http import HttpResponse
def status(request):
    return HttpResponse("Estamos online!!")

