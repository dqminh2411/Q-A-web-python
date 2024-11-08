t = int(input())
while t > 0:
    t -= 1
    r = [int(1e9)] * 3
    input()
    l = input()
    idx = len(l)//3
    if l[idx] != ' ': idx -= 1
    a = l[:idx]
    l = l[idx:]
    
    for i in map(int,a.split()):
        if i <= r[0]:
            r[2] = r[1]
            r[1] = r[0]
            r[0] = i
        elif i<=r[1]:
            r[2] = r[1]
            r[1] = i
        elif i < r[2]:
            r[2] = i

    idx = len(l) // 2
    while l[idx] != ' ':
        idx -= 1
    a = l[:idx]
    l = l[idx:]

    for i in map(int,a.split()):
        if i <= r[0]:
            r[2] = r[1]
            r[1] = r[0]
            r[0] = i
        elif i<=r[1]:
            r[2] = r[1]
            r[1] = i
        elif i < r[2]:
            r[2] = i

    for i in map(int,l.split()):
        if i <= r[0]:
            r[2] = r[1]
            r[1] = r[0]
            r[0] = i
        elif i<=r[1]:
            r[2] = r[1]
            r[1] = i
        elif i < r[2]:
            r[2] = i

    print(sum(r))
