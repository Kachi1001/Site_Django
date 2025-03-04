from decouple import config
import requests
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from urllib.parse import urlencode
import logging

logger = logging.getLogger(__name__)

# Configurações globais
TIMEOUT = 60  # Timeout para todas as requisições externas
MAX_RETRIES = 2  # Número máximo de tentativas de refresh do token

@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "PATCH", "DELETE"])
def proxy_api(request, path):
    # Configuração da sessão HTTP com connection pooling
    session = requests.Session()
    adapter = requests.adapters.HTTPAdapter( # type: ignore
        pool_connections=50,
        pool_maxsize=100,
        max_retries=1
    )
    session.mount('http://', adapter)
    
    # Verificação do token
    token = request.session.get('api_token')
    if not token or 'access' not in token:
        return JsonResponse({'error': 'Não autenticado'}, status=401)
    
    # Construção dinâmica dos headers
    headers = {
        'Authorization': f'Bearer {token["access"]}',
        'X-User-ID': str(request.user.id)
    }
    
    # Headers opcionais
    optional_headers = ['Content-Type', 'X-CSRFToken']
    for header in optional_headers:
        if header in request.headers:
            headers[header] = request.headers[header]

    # Prepara os parâmetros da requisição
    api_url = f"{config('API_EXTERNAL')}{path}"
    params = request.GET.dict()
    data = request.body
    
    for attempt in range(MAX_RETRIES + 1):
        try:
            # Faz a requisição usando o mesmo método
            response = session.request(
                method=request.method,
                url=api_url,
                headers=headers,
                params=params,
                data=data,
                timeout=TIMEOUT,
                stream=True  # Habilita streaming de resposta
            )
            
            # Tratamento de status code
            if response.status_code in (200, 204):
                return HttpResponse(
                    response.iter_content(chunk_size=8192),
                    content_type=response.headers.get('Content-Type', 'application/json'),
                    status=response.status_code
                )
            
            if response.status_code == 401 and attempt < MAX_RETRIES:
                # Tenta renovar o token
                new_token = refresh_token(token.get('refresh'))
                if new_token:
                    request.session['api_token'] = new_token
                    headers['Authorization'] = f'Bearer {new_token["access"]}'
                    continue
            
            # Repassa outros status codes
            return HttpResponse(
                response.content,
                content_type=response.headers.get('Content-Type', 'application/json'),
                status=response.status_code
            )
            
        except requests.Timeout:
            logger.error("Timeout na API externa")
            return JsonResponse(
                {'error': 'Timeout na comunicação com o servidor'},
                status=504
            )
        except requests.RequestException as e:
            logger.error(f"Erro na requisição: {str(e)}")
            return JsonResponse(
                {'error': 'Erro de comunicação com a API'},
                status=500
            )
    
    return JsonResponse(
        {'error': 'Falha após múltiplas tentativas'},
        status=503
    )

from django.core.cache import cache
def refresh_token(refresh_token):
    cache_key = f"token_refresh_{refresh_token}"
    if cached := cache.get(cache_key):
        return cached
    """Renova o token de acesso de forma segura"""
    try:
        response = requests.post(
            f"{config('API_EXTERNAL')}/token/refresh",
            json={'refresh': refresh_token},
            timeout=5
        )
        if response.status_code == 200:
          cache.set(cache_key, response.json(), timeout=300)
          return response.json()
    except Exception as e:
        logger.error(f"Erro ao renovar token: {str(e)}")
    return None