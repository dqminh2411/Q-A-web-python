def find(n,k):
    c = chr(ord('A')+n-1)
    l,r = 1,2**n-1
    while l<=r:
        m = (l+r)//2
        if m == k:
            return c
        elif m > k:
            r = m-1
        else:
            l = m+1
        c = chr(ord(c)-1)
        
t = int(input())
while t > 0:
    n,k = map(int,input().split())
    print(find(n,k))
    t -= 1