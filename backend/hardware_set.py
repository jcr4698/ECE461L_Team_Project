



class HWSet():

    def __init__(self, qty: int, id: str, auth_users: list):
        self.__capacity=qty
        self.__availability=self.capacity
        self.__id=id
        self.__auth_users=auth_users

    def get_availability(self):
        return self.__availability

    def get_capacity(self):
        return self.__capacity
    
    def get_checkedout_qty(self):
        return self.__capacity - self.__availability

    def check_out(self, qty):
        if(self.__availability > qty):
            self.__availability -= qty
        else:
            self.__availability=0
            return -1

    def check_in(self, qty):
        self.__availability += qty 
    
    def get_id(self):
        return self.__id
    
    def is_authorized(self, user: str) -> bool:
        if user in self.__auth_users:
            return True
        return False
    

