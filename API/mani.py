from .serializers import SerializerTipo
from .models import *
from django.db import IntegrityError, transaction
# from django.utils import timezone
from rest_framework.response import Response
import json   
from datetime import datetime
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

    def Colaborador(user, parametro):
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
class edit:
    def Colaborador(user, parametro):
        try:
            with transaction.atomic():
                if parametro['nome'] == "":
                    return Response({'message': 'Erro ao salvar Colaborador: Não o nome não pode ser nulo'}, status=400) 
                else:
                    x = Colaborador.objects.get(id=parametro['id'])
                    x.nome = parametro['nome'] 
                    if parametro['admissao'] != '': x.admissao = parametro['admissao'] 
                    if parametro['demissao'] != '': x.demissao = parametro['demissao']
                    x.diaria = parametro['diaria']
                    x.observacao=parametro['observacao']
                    x.funcao=parametro['funcao']
                    x.contrato=parametro['contrato']
                    x.encarregado= parametro['encarregado']     
                    print(parametro['funcao'] )          
                    x.save()
                    Historico(idr=x.id,user=user,action='UPDATE',context=f"COLABORADOR <{x.nome}> EDITADO")
                    return Response({'message': 'Cadastrado com sucesso'})
                
        except IntegrityError as e:
            # Capturar a exceção e extrair a mensagem de erro
            error_message = str(e)
            return Response({'message': f'Erro ao adicionar função: {error_message}'}, status=400)
        
class delete:
    def Colaborador(user, id):
        try:
            with transaction.atomic():
                    x = Colaborador.objects.get(id=id)         
                    x.delete()
                    Historico(idr=x.id,user=user,action='UPDATE',context=f"COLABORADOR <{x.nome}> EDITADO")
                    return Response({'message': 'Deletado com sucesso'})
                
        except IntegrityError as e:
            # Capturar a exceção e extrair a mensagem de erro
            error_message = str(e)
            return Response({'message': f'Erro ao adicionar função: {error_message}'}, status=400)