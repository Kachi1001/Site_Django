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
                return redirect(request.POST.get('next', '/').replace('%2F','/'))
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
    resource = models.Pendencia
    try:
        queryset = resource.objects.get(pk=request.user.id)
    except:
        queryset = resource.objects.create(pk=request.user.id)
        
    if not queryset.password_change:
        retorno = redirect('alterar_senha')
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
            queryset = models.Pendencia.objects.get(pk=user.id)
            queryset.password_change = True
            queryset.save()
            return redirect('home')

from django.http import HttpResponse
def status(request):
    return HttpResponse("Estamos online!!")

from django.http import JsonResponse, HttpResponse

from django.views.decorators.csrf import csrf_exempt
@login_required # type: ignore
@csrf_exempt
def proxy_api(request, path):
    from urllib.parse import urlencode

    token = request.session.get('api_token')  # Recupera o token da sessão
    if not token:
      return JsonResponse({'error': 'Usuário não autenticado'}, status=401)

    api_url = f"{config('API_EXTERNAL')}{path}"
    # Transfere os métodos, cabeçalhos e corpo da requisição original
    headers = {'Authorization': f'Bearer {token['access']}'} 
    headers['X-User-ID'] = str(request.user.id)
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
        elif request.method == "PATCH":
            response = requests.patch(api_url, headers=headers, data=request.body)
        elif request.method == "DELETE":
            response = requests.delete(api_url, headers=headers)
        else:
            return JsonResponse({'error': 'Método não suportado'}, status=405)
    except requests.RequestException as e:
        return JsonResponse({'message': 'Erro ao conectar à API','error':str(e)}, status=500)
    else:
        if response.status_code == 200 or response.status_code == 204:
            # Retorna o conteúdo da resposta com o mesmo status
            return HttpResponse(response.content, content_type=response.headers.get('Content-Type', 'application/json'), status=response.status_code)
        elif response.status_code == 401:
            api_response = requests.post(f"{config('API_EXTERNAL')}/token/refresh", json={
                'refresh': token.get('refresh', ''),
            })
            if api_response.status_code == 200:
                request.session['api_token'] = api_response.json()  # Salva o token na sessão
                return proxy_api(request, path)
            else:
                return JsonResponse({'Error': 'Token invalido, redirecionando para login'}, status=response.status_code)
        else:
            # Se a API retornar um erro, repassa o erro
            return HttpResponse(response, status=response.status_code)

