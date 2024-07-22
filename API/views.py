from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import psycopg2
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .models import *
import json   
from django.http import JsonResponse
from .mani import *

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
def cadastrar(request):
    parametro = json.loads(request.POST.get('parametro'))
    metodo = request.POST.get('metodo')
    owner = request.POST.get('user') 
    if metodo == 'Funcao':
        return register.Funcao(owner, parametro)
    if metodo == 'Colaborador':
        return register.Colaborado(owner, parametro)
    if metodo == 'Historico':
        return register.Historico("1",'teste','create','teste')
    
@api_view(['POST'])
def salas(request):
    id = request.POST.get('id')
    metodo = request.POST.get('metodo')
    x = AgendaSalas.objects.get(id=id)
    if metodo == "deletar":
        x.delete()
        return Response({'message':'Deletado com sucesso'})
    elif metodo == 'editar':
        x.responsavel = request.POST.get('responsavel')
        x.descricao = request.POST.get('descricao')
        x.save()
        return Response({'message':'Editado com sucesso'})
    else:
        return Response({'message':'Houve algum problema'})
