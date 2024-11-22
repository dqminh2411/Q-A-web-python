num = input()
c = 0
for x in num:
    if x == "4" or x == "7":
        c+=1
print("YES" if c == 4 or c == 7 else "NO")
# uoc cua n
# 1 -> n
# n - uoc cua n - boi cua cac uoc
# 1 2 3 4 5 6 7 8 9 10
# 0 1 0 1  1 0 1 0 1  = 4
#
# 1 2 3 4 5 6 7
# 0 0 0 0 0 0 1

