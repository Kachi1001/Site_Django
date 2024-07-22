from .serializers import SerializerTipo
from .models import *
from django.db import IntegrityError, transaction
from datetime import datetime
from rest_framework.response import Response
import json   

class register:
    def Funcao(user, parametro):
        funcao = parametro['funcao']
        try:
            with transaction.atomic():
                if funcao == "":
                    return Response({'message': 'Erro ao adicionar função: Não pode ser valor nulo'}, status=400) 
                else:
                    func = Funcao(funcao=funcao)
                    register.Historico(idr=Funcao.objects.latest('id').id +1,user=user,action='CREATE',context=f"FUNÇÃO <{func.funcao}> ADICIONADA")
                    func.save()
                    return Response({'message': 'Cadastrado com sucesso'})
                
        except IntegrityError as e:
            # Capturar a exceção e extrair a mensagem de erro
            error_message = str(e)
            return Response({'message': f'Erro ao adicionar função: {error_message}'}, status=400)

    def Colaborado(user, parametro):
        nome = parametro['nome']
        diaria = None if parametro['contrato'] == 'CLT' else parametro['diaria']
        admissao = None if parametro['admissao'] == '' else parametro['admissao']
        try:
            with transaction.atomic():
                if nome == "":
                    return Response({'message': 'Erro ao adicionar Colaborador: Não o nome não pode ser nulo'}, status=400) 
                else:
                    x = Colaborador(
                        nome=nome,
                        admissao=admissao,
                        demissao=None,
                        diaria=diaria,
                        observacoes=parametro['observacao'],
                        funcao=parametro['funcao'],
                        contrato=parametro['contrato'],
                        encarregado=parametro['encarregado'],
                    )
                    register.Historico(idr=Colaborador.objects.latest('id').id +1,user=user,action='CREATE',context=f"COLABORADOR <{x.nome}> ADICIONADO")
                    x.save()
                    return Response({'message': 'Cadastrado com sucesso'})
                
        except IntegrityError as e:
            # Capturar a exceção e extrair a mensagem de erro
            error_message = str(e)
            return Response({'message': f'Erro ao adicionar função: {error_message}'}, status=400)
    
    
    def Historico(idr,user,action,context):
        try:
            hist = Historico(
                idr=idr,user=user,data=datetime.now(),action=action,context=context
            )
        except IntegrityError as e:
            error_message = str(e)
            return Response({'message': f'Erro ao registrar histórico {error_message}'}, status=400)
        finally:
            hist.save()