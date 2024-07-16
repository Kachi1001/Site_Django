from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import psycopg2
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .models import *
import json   
from django.db import IntegrityError, transaction
from django.http import JsonResponse

# Configurações de conexão com o banco de dados PostgreSQL
dbname = settings.DATABASES['default']['NAME']
user = settings.DATABASES['default']['USER']
password = settings.DATABASES['default']['PASSWORD']
host = settings.DATABASES['default']['HOST']
port = settings.DATABASES['default']['PORT']

@api_view(['POST'])
def executar_funcao_geraViewJunta(request): 
    # Parâmetro passado pelo front end
    parametro = request.GET.get('parametro')


    # Conectando ao banco de dados
    conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)
    cursor = conn.cursor()
    
    try:
        # Executando a função
        cursor.execute("SELECT gera_view_junta()")
        conn.commit()

        # Retornando uma resposta de sucesso
        return Response({'message': 'Tabela criada com sucesso'})

    except psycopg2.Error as e:
        return Response({'error': str(e)}, status=400)

    finally:
        cursor.close()
        conn.close()
        
@api_view(['POST']) 
def criarFuncao(request):
    try:
        with transaction.atomic():
            nome = request.POST.get('parametro')
            if nome == "":
                return Response({'message': 'Erro ao adicionar função: Não pode ser valor nulo'}, status=400) 
            else:
                func = Funcao(funcao=nome)
                func.save()
                return Response({'message': 'Cadastrado com sucesso'})  
    except IntegrityError as e:
        # Capturar a exceção e extrair a mensagem de erro
        error_message = str(e)
        return Response({'message': f'Erro ao adicionar função: {error_message}'}, status=400)