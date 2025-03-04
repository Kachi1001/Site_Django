from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as login_django, logout as logout_django, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from . import models

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
            api_url = f"{config('API_EXTERNAL')}token"
            api_response = requests.post(api_url, json={
                'username': username,
                'password': password
            })
            if api_response.status_code == 200:
                request.session['api_token'] = api_response.json()  # Salva o token na sessão
                return redirect(request.POST.get('next', '/').replace('%2F','/').replace('%3F', '?').replace('%3D', '='))
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
    
    retorno = render(request, f"{app}/index.html")
    # resource = models.Pendencia
    # try:
        # queryset = resource.objects.get(pk=request.user.id)
    # except:
        # queryset = resource.objects.create(pk=request.user.id)
        
    # if not queryset.password_change:
        # retorno = redirect('alterar_senha')
    return retorno

@login_required
def teste(request):
    return render(request, 'teste.html')

@login_required # type: ignore
def alterar_senha(request):
    match request.method:
        case 'GET':
            return render(request, f"{app}/alterar_senha.html")
        case 'POST':
            data = request.POST
            user = request.user
            if data['senha'] != data['senha_2']:
                return render(request, f'{app}/alterar_senha.html')
            user.set_password(data['senha'])
            user.save()
            
            # Atualiza a sessão para evitar logout após mudança de senha
            update_session_auth_hash(request, user)
            # queryset = models.Pendencia.objects.get(pk=user.id)
            # queryset.password_change = True
            # queryset.save()
            return redirect('home')

from django.http import HttpResponse
def status(request):
    return HttpResponse("Estamos online!!")

def minigames(request, game):
    return render(request, f'Home/minigames/{game}.html')