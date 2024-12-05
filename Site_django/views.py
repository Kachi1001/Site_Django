from django.shortcuts import redirect
import requests
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from decouple import config

@csrf_exempt 
def proxy_api(request, path):
    """
    Proxy genérico para redirecionar requisições do Django para a API externa.
    """
    token = request.session.get('api_token')  # Recupera o token da sessão
    if not token:
      return redirect('/login')
      return JsonResponse({'error': 'Usuário não autenticado'}, status=401)

    api_url = f"{config('API')}{path}"

    # Transfere os métodos, cabeçalhos e corpo da requisição original
    headers = {'Authorization': f'Bearer {token}'}
    if 'Content-Type' in request.headers:
      headers['Content-Type'] = request.headers['Content-Type']
    if 'X-CSRFToken' in request.headers:
      headers['X-CSRFToken'] = request.headers['X-CSRFToken'] 
    # Faz a chamada correspondente ao método HTTP
    try:
        if request.method == "GET":
            response = requests.get(api_url, headers=headers, params=request.body)
        elif request.method == "POST":
            response = requests.post(api_url, headers=headers, json=request.body)
        elif request.method == "PUT":
            response = requests.put(api_url, headers=headers, json=request.body)
        elif request.method == "DELETE":
            response = requests.delete(api_url, headers=headers)
        else:
            return JsonResponse({'error': 'Método não suportado'}, status=405)
        if response.status_code == 200:
            # Retorna o conteúdo da resposta com o mesmo status
            return HttpResponse(response.content, content_type=response.headers.get('Content-Type', 'application/json'), status=response.status_code)
        else:
            # Se a API retornar um erro, repassa o erro
            return JsonResponse(response.json(), status=response.status_code)

    except requests.RequestException as e:
        return JsonResponse({'message': 'Erro ao conectar à API','error':str(e)}, status=500)
