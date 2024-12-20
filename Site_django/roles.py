from zoneinfo import available_timezones
from rolepermissions.roles import AbstractUserRole

class supervisor(AbstractUserRole):
    available_permissions = {
        'Lancamento_obra': True,
        'Lancamento_obra-consultas': True,
        'Lancamento_obra-impressoes': True,
    }
    role_name='supervisor'
class app_Lancamento_obra(AbstractUserRole):
    app = 'Lancamento_obra'
    available_permissions = {
        f'{app}': True,
        f'{app}-cadastros': True,
        f'{app}-lancamentos': True,
        f'{app}-tabelas': True,
        f'{app}-consultas': True,
        f'{app}-impressoes': True,
        f'{app}-graficos': True,
    }
    role_name=f'app_{app}'
    
class app_Depto_pessoal(AbstractUserRole):
    app = 'Depto_pessoal'
    available_permissions = {
        f'{app}': True,
        f'{app}-colaborador': True,
        f'{app}-ferias': True,
        f'{app}-ponto': True,
        f'{app}-lembrete': True,
        f'{app}-menu': True,
    }
    role_name=f'app_{app}'

class ambientes(AbstractUserRole):
    app = 'ambiente'
    available_permissions = {
        f'{app}-teste': True,
        f'{app}-dev': True,
        f'{app}-prod': True,
    }
    role_name=f'app_{app}'
    