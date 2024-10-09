from zoneinfo import available_timezones
from rolepermissions.roles import AbstractUserRole

class supervisor(AbstractUserRole):
    available_permissions = {
        'Lancamento_obra': True,
        'Lancamento_obra-consultas': True,
    }
    role_name='supervisor'
class app_Lancamento_obra(AbstractUserRole):
    app = 'Lancamento_obra'
    available_permissions = {
        f'{app}': True,
        f'{app}-cadastros': True,
        f'{app}-consultas': True,
        f'{app}-lancamentos': True,
        f'{app}-tabelas': True,
    }
    role_name=f'app_{app}'
    
class app_Depto_pessoal(AbstractUserRole):
    app = 'Depto_pessoal'
    available_permissions = {
        f'{app}': True,
        f'{app}-colaborador': True,
        f'{app}-ferias': True,
        f'{app}-pontos': True,
        f'{app}-lembretes': True,
    }
    role_name=f'app_{app}'
    