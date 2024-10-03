from zoneinfo import available_timezones
from rolepermissions.roles import AbstractUserRole

class supervisor(AbstractUserRole):
    available_permissions = {
        'lancamento_obra': True,
        'lancamento_obra-consultas': True,
    }
    role_name='supervisor'
class app_lancamento_obra(AbstractUserRole):
    available_permissions = {
        'lancamento_obra': True,
        'lancamento_obra-cadastros': True,
        'lancamento_obra-lancamentos': True,
        'lancamento_obra-tabelas': True,
        'lancamento_obra-consultas': True,
    }
    role_name='app_lancamento_obra'
    
class app_Depto_pessoal(AbstractUserRole):
    app = 'Depto_pessoal'
    available_permissions = {
        f'{app}': True,
        f'{app}-cadastros': True,
        f'{app}-tabelas': True,
        f'{app}-consultas': True,
    }
    role_name=f'app_{app}'
    