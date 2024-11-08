MAXN = 10000
isPrime = [True] * (MAXN + 1)
primes = []
def sieve():
    isPrime[0] = isPrime[1] = False
    for i in range(101):
        if isPrime[i] == True:
            for j in range(i*i, MAXN+1,i):
                isPrime[j] = False
    for i in range(MAXN + 1):
        if isPrime[i] == True:
            primes.append(i)

def upper_bound(x):
    l,r = 0,len(primes)-1
    idx = -1 # x larger than any prime in primes
    while l <= r:
        m = (l+r)//2
        if primes[m] > x:
            r = m-1
            idx = m
        elif primes[m] < x:
            l = m + 1
    return idx

sieve()
n = int(input())
l = list(map(int,input().split()))
res = 0
for x in l:
    if not isPrime[x]:
        idx = upper_bound(x)
        dif = 0
        if idx == -1:
            dif = x - primes[-1]
        elif idx == 0:
            dif = primes[0] - x
        else:
            low = primes[idx-1]
            dif = min(x-low, primes[idx] - x)
            
        res = max(res,dif)
print(res)
