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
        f'{app}-integracao': True,
        f'{app}-avaliacao': True,
        f'{app}-lembrete': True,
        f'{app}-feriado': True,
        f'{app}-graficos': True,
        f'{app}-import': True,
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
    
class app_Curriculos(AbstractUserRole):
    app = 'Curriculos'
    available_permissions = {
        f'{app}': True,
        f'{app}-candidato': True,
        f'{app}-cadastros': True,
        f'{app}-consultas': True,
    }
    role_name=f'app_{app}'

class app_Almoxarifado(AbstractUserRole):
    app = 'Almoxarifado'
    available_permissions = {
        f'{app}': True,
        f'{app}-produto': True,
        f'{app}-ficha_padrao': True,
        f'{app}-numeracao': True,
        f'{app}-ficha': True,
        f'{app}-cadastra_epi': True,
        f'{app}-movimentar': True,
        f'{app}-colaborador': True,
    }
    role_name=f'app_{app}'
