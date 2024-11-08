import math
MOD = int(1e9+7)

t = int(input())
while t > 0:
    n,k = map(int,input().split())
    bink = format(k,'b')
    l = len(bink)
    res = 0
    for i in range(l):
        if bink[l-i-1]=='1':
            res += n**i
            res %= MOD
    print(res)
    t -= 1
    
    
