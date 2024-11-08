res = []
a = [0] * 11
def Try(i,lim,n):
    if n==0:
        res.append(a[:i])
        return
    for j in range(n,0,-1):
        if j <= lim:
            a[i] = j
            Try(i+1,j,n - j)

t = int(input())
while t > 0:
    t -= 1
    n = int(input())
    Try(0,n,n)
    print(len(res))
    for x in res:
        print('(', end = '')
        for i in range(len(x)-1):
            print(x[i], end = ' ')
        print(str(x[-1])+')', end = ' ')
    print()
    res.clear()
