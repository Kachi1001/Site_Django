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
            api_url = f"{config('API_EXTERNAL')}token"
            api_response = requests.post(api_url, json={
                'username': username,
                'password': password
            })
            if api_response.status_code == 200:
                request.session['api_token'] = api_response.json()  # Salva o token na sessão
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

from django.http import JsonResponse, HttpResponse

@login_required
def proxy_api(request, path):
    from urllib.parse import urlencode
    """
    Proxy genérico para redirecionar requisições do Django para a API externa.
    """
    token = request.session.get('api_token')  # Recupera o token da sessão
    if not token:
    #   return redirect('/login')
      return JsonResponse({'error': 'Usuário não autenticado'}, status=401)

    api_url = f"{config('API_EXTERNAL')}{path}"
    # Transfere os métodos, cabeçalhos e corpo da requisição original
    headers = {'Authorization': f'Bearer {token['access']}'} 
    if 'Content-Type' in request.headers:
      headers['Content-Type'] = request.headers['Content-Type']
    if 'X-CSRFToken' in request.headers:
      headers['X-CSRFToken'] = request.headers['X-CSRFToken'] 
    # Faz a chamada correspondente ao método HTTP
    try:
        if request.method == "GET":
            params = request.GET.dict()
            full_url = f"{api_url}?{urlencode(params)}" if params else api_url
            response = requests.get(full_url, headers=headers)
        elif request.method == "POST":
            response = requests.post(api_url, headers=headers, data=request.body)
        elif request.method == "PUT":
            response = requests.put(api_url, headers=headers, data=request.body)
        elif request.method == "DELETE":
            response = requests.delete(api_url, headers=headers)
        else:
            return JsonResponse({'error': 'Método não suportado'}, status=405)
        if response.status_code == 200 or response.status_code == 204:
            # Retorna o conteúdo da resposta com o mesmo status
            return HttpResponse(response.content, content_type=response.headers.get('Content-Type', 'application/json'), status=response.status_code)
        elif response.status_code == 401:
            print(token)
            api_response = requests.post(f"{config('API_EXTERNAL')}/token/refresh", json={
                'refresh': token['refresh'],
            })
            if api_response.status_code == 200:
                request.session['api_token'] = api_response.json()  # Salva o token na sessão
                return proxy_api(request, path)
        else:
            # Se a API retornar um erro, repassa o erro
            return JsonResponse(response.json(), status=response.status_code)

    except requests.RequestException as e:
        return JsonResponse({'message': 'Erro ao conectar à API','error':str(e)}, status=500)
