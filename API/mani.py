from .serializers import SerializerTipo
from .models import *
from django.db import IntegrityError, transaction
from django.utils import timezone

from rest_framework.response import Response
import json   

class register:
    
    def Historico(idr,user,action,context):
        try:
            Historico.objects.create(
                idr=idr,user=user,data=datetime.now(),action=action,context=context
            )
            
        except IntegrityError as e:
            error_message = str(e)
            return Response({'message': f'Erro ao registrar histórico {error_message}'}, status=400)
        finally:
            return Response({'message': 'Sucesso'})
        
    def Funcao(user, parametro):
        funcao = parametro['funcao']
        try:
            with transaction.atomic():
                if funcao == "":
                    return Response({'message': 'Erro ao adicionar função: Não pode ser valor nulo'}, status=400) 
                else:
                    func = Funcao(funcao=funcao,grupo=parametro['grupo'])
                    func.save()
                    register.Historico(idr=func.id,user=user,action='CREATE',context=f"FUNÇÃO <{func.funcao}> ADICIONADA")
                    
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
                    
                    x.save()
                    register.Historico(idr=x.id,user=user,action='CREATE',context=f"COLABORADOR <{x.nome}> ADICIONADO")
                    return Response({'message': 'Cadastrado com sucesso'})
                
        except IntegrityError as e:
            # Capturar a exceção e extrair a mensagem de erro
            error_message = str(e)
            return Response({'message': f'Erro ao adicionar função: {error_message}'}, status=400)
    
    def Supervisor(user, parametro):
        try:
            with transaction.atomic():  
                if parametro['supervisor'] == "":
                    return Response({'message': 'Erro ao adicionar supervisor: Não pode ser valor nulo'}, status=400) 
                else:
                    x = Supervisor(supervisor=parametro['supervisor'], ativo=parametro['ativo'])
                    x.save()
                    register.Historico(idr=x.supervisor,user=user,action='CREATE',context=f"SUPERVISOR <{x.supervisor}> ADICIONADA")
                    
                    return Response({'message': 'Cadastrado com sucesso'})
        except IntegrityError as e:
                # Capturar a exceção e extrair a mensagem de erro
                error_message = str(e)
                return Response({'message': f'Erro ao adicionar função: {error_message}'}, status=400)
    