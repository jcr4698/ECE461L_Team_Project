class HWSet():

    def __init__(self, qty: int):
        self.capacity=qty
        self.availability=self.capacity

    def get_availability(self):
        return self.availability

    def get_capacity(self):
        return self.capacity
    
    def get_checkedout_qty(self):
        return self.capacity - self.availability

    def check_out(self, qty):
        if(self.availability > qty):
            self.availability -= qty
        else:
            self.availability=0
            return -1

    def check_in(self, qty):
        self.availability += qty 