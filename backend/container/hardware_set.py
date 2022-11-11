class HWSet():

    def __init__(self, id, qty: int):
        self.id=id
        self.capacity=qty
        self.availability=self.capacity

    def get_availability(self):
        return self.availability

    def get_capacity(self):
        return self.capacity
    
    def get_checkedout_qty(self):
        return self.capacity - self.availability

    def get_id(self):
        return self.id