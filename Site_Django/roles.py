from rolepermissions.roles import AbstractUserRole

class perm1(AbstractUserRole):
    available_permissions = {
        'lançamento': True,
        'teste': True,
    }
    
class perm2(AbstractUserRole):
    available_permissions = {
        'admin': True,
    }
