n = int(input())
l = list(map(int,input().split()))
steps = [0] * n
for i in range(n):
    for j in l:
        if j != l[i]:
            steps[i] += abs(j - l[i])
min_step = min(steps)
for i in range(n):
    if steps[i] == min_step:
        print(steps[i],l[i])
        break
    