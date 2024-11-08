class Sv:
    def __init__(self,ma,ten,lop):
        self.ma = ma
        self.ten = ten
        self.lop = lop
        self.cc = 10
        self.tt = ''
    def set_cc(self,cc):
        for i in cc:
            if i == 'm':
                self.cc -= 1
            elif i == 'v':
                self.cc -= 2
        if self.cc < 0:
            self.cc = 0
        if self.cc == 0:
            self.tt = 'KDDK'
        
    def __str__(self):
        return self.ma + ' ' + self.ten + ' ' + self.lop + ' ' + str(self.cc) + ' ' + self.tt

n = int(input())
l = []
for i in range(n):
    l.append(Sv(input(),input(),input()))
for i in range(n):
    ma,cc = input().split()
    for x in l:
        if x.ma == ma:
            x.set_cc(cc)
            break
for x in l:
    print(x)

