from rolepermissions.roles import AbstractUserRole

class lancamento_obra(AbstractUserRole):
    available_permissions = {'Lançamento_obra_app': True}