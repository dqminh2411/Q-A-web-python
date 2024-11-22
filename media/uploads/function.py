
def min_subarray_sum(l):
    st,end = 0,len(l)
    tmp_min = int(1e9)
    for i in range (len(l)):
        s = 0
        for j in range(i,len(l)):
            s += l[j]
            if s < tmp_min:
                tmp_min = s
                st,end = i,j
    return l[st:end+1]

def min_subarray_sum_1(l):
    st,end = 0,len(l)
    all_min = int(1e9)
    end_min = int(1e9)
    for i in range(len(l)):
        if end_min > 0:
            end_min = l[i]
            st = i
        else:
            end_min += l[i]
        if end_min < all_min:
            end = i
            all_min = end_min
    return l[st:end+1]
l = [3,-2,-1,5,7,8,9,-10,-2,4,5,6]
print(min_subarray_sum_1(l))        