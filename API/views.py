from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import psycopg2
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt


@api_view(['POST'])

def executar_funcao_geraViewJunta(request): 
    # Parâmetro passado pelo front end
    parametro = request.GET.get('parametro')

    # Configurações de conexão com o banco de dados PostgreSQL
    dbname = settings.DATABASES['default']['NAME']
    user = settings.DATABASES['default']['USER']
    password = settings.DATABASES['default']['PASSWORD']
    host = settings.DATABASES['default']['HOST']
    port = settings.DATABASES['default']['PORT']

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