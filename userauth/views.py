from itertools import chain
import json
from  django . shortcuts  import  get_object_or_404, render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import Followers, LikePost, Post, Profile, Comment, LikeComment
from django.db.models import Q
from django.db import models
from django.http import JsonResponse
from django.forms.models import model_to_dict
from pyvi import ViPosTagger, ViTokenizer
from rake_nltk import Rake
import spacy
from langdetect import detect
def signup(request):
    try:
        if request.method == 'POST':
            fnm=request.POST.get('fnm')
            emailid=request.POST.get('emailid')
            pwd=request.POST.get('pwd')
            print(fnm,emailid,pwd)
            my_user=User.objects.create_user(fnm,emailid,pwd)
            my_user.save()
            user_model = User.objects.get(username=fnm)
            new_profile = Profile.objects.create(user=user_model)
            new_profile.save()
            if my_user is not None:
                login(request,my_user)
                return redirect('/')
            return redirect('/loginn')
        
            
    except:
            invalid="User already exists"
            return render(request, 'signup.html',{'invalid':invalid})
    
        
    return render(request, 'signup.html')

def loginn(request):
 
    if request.method == 'POST':
        fnm=request.POST.get('fnm')
        pwd=request.POST.get('pwd')
        print(fnm,pwd)
        userr=authenticate(request,username=fnm,password=pwd)
        if userr is not None:
            print('có user', userr)
            login(request,userr)
            return redirect('/')
        
 
        invalid="Invalid Credentials"
        return render(request, 'loginn.html',{'invalid':invalid})
               
    return render(request, 'loginn.html')

@login_required(login_url='/loginn')
def logoutt(request):
    logout(request)
    return redirect('/loginn')


@login_required(login_url='/loginn')
def home(request):
    
    # Lấy thông tin hồ sơ của người dùng hiện tại
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist: # nếu người dùng chưa có proflie thì tạo mới (thường là admin)
        profile = Profile.objects.create(user=request.user)
        profile.save()

    
    # Lấy tất cả các bài viết, sắp xếp theo lượt vote giảm dần (no_of_likes)
    posts = Post.objects.all().order_by('-no_of_likes')
    

    # Truyền dữ liệu vào context để hiển thị trong template
    context = {
        'posts': posts,  # Chuyển đổi từ 'post' thành 'posts' vì giờ có nhiều bài viết hơn
        'profile': profile,
    }
    return render(request, 'main.html', context)



def explore(request):
    post = Post.objects.all().order_by('-created_at')
    profile = Profile.objects.get(user=request.user)
    context = {
        'post': post,
        'profile': profile

    }
    return render(request, 'explore.html', context)

@login_required(login_url='/loginn')
def upload(request):
    if request.method == 'POST':
        user = request.user
        title = request.POST['title']
        file = request.FILES.get('file_upload')  # Lấy file từ form
        caption = request.POST['caption']
        subject = request.POST['subject']
        # Tạo bài viết mới với file
        # khi file is None, new_post.file được gán 1 instance of FieldFile dù không có file nào cả
        # để check xem new_post.file có file hay k, dùng if new_post.file.name: True if name = ''
        new_post = Post.objects.create(user=user, title=title, file=file, caption=caption, subject=subject)
        new_post.save()

        return redirect('/')
    else:
        return redirect('/')

@login_required(login_url='/loginn')
def likes(request, id):
    post = get_object_or_404(Post, id=id)
    like_filter = LikePost.objects.filter(post=post, user=request.user).first()
    if request.method == 'GET': # check user hien tai da like post nay chua
        return JsonResponse({'no_of_likes': post.no_of_likes, 'liked': like_filter is not None})
    if request.method == 'POST':
        if like_filter is None:
            new_like = LikePost.objects.create(post=post, user=request.user)
            post.no_of_likes = post.no_of_likes + 1
        else:
            like_filter.delete()
            post.no_of_likes = post.no_of_likes - 1

        post.save()

        # Generate the URL for the current post's detail page
        print(post.id)

        # Redirect back to the post's detail page
        # return redirect('/#'+id)
        return JsonResponse({'no_of_likes': post.no_of_likes, 'liked': like_filter is None})

def liked_posts(request):
    posts_id = LikePost.objects.filter(user=request.user)
    liked_posts = Post.objects.filter(id__in=[post.post_id for post in posts_id])
    profile = Profile.objects.get(user=request.user)
    context = {
        'posts': liked_posts,
        'profile' : profile,
    }
    return render(request, 'liked_posts.html', context)


@login_required(login_url='/loginn')
def postdetail(request, post_id):
    # Lấy bài viết dựa trên ID
    post = get_object_or_404(Post, id=post_id)

    # Lấy thông tin hồ sơ của người dùng hiện tại
    profile = Profile.objects.get(user=request.user)

    # # Lấy danh sách các bình luận liên quan đến bài viết
    # comments = post.comments.all().order_by('-created_at')

    # Xử lý khi người dùng gửi bình luận
    if request.method == 'POST':
        content = request.POST.get('content')
        if content:
            Comment.objects.create(post=post, user=request.user, content=content)
            return redirect('postdetail', post_id=post.id)  # Reload lại trang

    post.caption = post.caption.replace('\n','<br>')
    post.save()
    print(post.caption)
    context = {
        'post': post,
        'profile': profile,
        # 'comments': comments,  # Truyền danh sách bình luận vào template
    }
    return render(request, 'postdetail.html', context)



@login_required(login_url='/loginn')
def profile(request,id_user):
    user_object = User.objects.get(username=id_user) # người muốn xem
    print(user_object) 
    profile = Profile.objects.get(user=request.user) # profile của người dùng hiện tại
    user_profile = Profile.objects.get(user=user_object) # profile của người muốn xem
    user_posts = Post.objects.filter(user=user_object).order_by('-created_at')
    user_post_length = len(user_posts)# số lượng bài viết 

    
    if Followers.objects.filter(follower=request.user, user=user_object).first(): # người dùng hiện tại có follow profile này k
        follow_unfollow = 'Unfollow'
    else:
        follow_unfollow = 'Follow'

    user_followers = len(Followers.objects.filter(user=user_object))
    user_following = len(Followers.objects.filter(follower=user_object))

    context = {
        'user_object': user_object,
        'user_profile': user_profile,
        'user_posts': user_posts,
        'user_post_length': user_post_length,
        'profile': profile,
        'follow_unfollow':follow_unfollow,
        'user_followers': user_followers,
        'user_following': user_following,
    }
    
    
    if request.user.username == id_user:
        if request.method == 'POST':
            if request.FILES.get('image') == None:
             image = user_profile.profileimg
             bio = request.POST['bio']
             location = request.POST['location']

             user_profile.profileimg = image
             user_profile.bio = bio
             user_profile.location = location
             user_profile.save()
            if request.FILES.get('image') != None:
             image = request.FILES.get('image')
             bio = request.POST['bio']
             location = request.POST['location']

             user_profile.profileimg = image
             user_profile.bio = bio
             user_profile.location = location
             user_profile.save()
            

            return redirect('/profile/'+id_user)
        else:
            return render(request, 'profile.html', context)
    return render(request, 'profile.html', context)

# @login_required(login_url='/loginn')
# def delete(request, id):
#     post = Post.objects.get(id=id)
#     post.delete()

#     return redirect('/profile/'+ request.user.username)


@login_required(login_url='/loginn')
def search_results(request):
    query = request.GET.get('q')

    users = Profile.objects.filter(user__username__icontains=query)
    posts = Post.objects.filter(Q(caption__icontains=query) | Q(title__icontains=query))

    context = {
        'query': query,
        'users': users,
        'posts': posts,
    }
    return render(request, 'search_user.html', context)
def home_post(request,id):
    post=Post.objects.get(id=id)
    profile = Profile.objects.get(user=request.user)
    context={
        'post':post,
        'profile':profile
    }
    return render(request, 'main.html',context)



def follow(request):
    if request.method == 'POST':
        follower = User.objects.get(username = request.POST['follower'])
        user = User.objects.get(username = request.POST['user'])

        if Followers.objects.filter(follower=follower, user=user).first():
            delete_follower = Followers.objects.get(follower=follower, user=user)
            delete_follower.delete()
            return redirect('/profile/'+user.username)
        else:
            new_follower = Followers.objects.create(follower=follower, user=user)
            new_follower.save()
            return redirect('/profile/'+user.username)
    else:
        return redirect('/')

@login_required(login_url='/loginn')
def search_by_subject(request):
    query = request.GET.get('query', '')  # Get the search query from GET parameters
    profile = Profile.objects.get(user=request.user)  # Get the user's profile

    # Filter posts based on the subject
    posts = Post.objects.filter(subject__icontains=query).order_by('-created_at')

    context = {
        'post': posts,  # Pass the filtered posts to the template
        'profile': profile,
        'query': query,  # Pass the search query for display
    }
    return render(request, 'explore.html', context)  # Render the explore template

def update_post(request,post_id):
    post = Post.objects.get(id=post_id)
    
    if request.method == 'POST':
        title = request.POST.get('title')
        file = request.FILES.get('file')
        caption = request.POST.get('caption')
        subject = request.POST.get('subject')
        remove = request.POST.get('remove')
        post.title = title
        if file is not None:
            post.file = file
        if remove == 'true' and file is None: # remove is string, not boolean
            post.file = None
        post.caption = caption
        post.caption = post.caption
        post.subject = subject
        post.save()

        if post.file is not None and post.file.name:
            return JsonResponse({'title':post.title, 'file':post.file.url, 'caption':post.caption, 'subject':post.subject, 'no_of_likes':post.no_of_likes})
        return JsonResponse({'title':post.title, 'caption':post.caption, 'subject':post.subject, 'no_of_likes':post.no_of_likes})

def delete_post(request, post_id):
    post = Post.objects.get(id=post_id)
    post.delete()
    return redirect('/profile/'+request.user.username)

    
def edit_comment(request,cmt_id):
    comment = Comment.objects.get(id=cmt_id)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        comment.content = request.POST.get('newContent')
        comment.save()
        return JsonResponse({'cmtContent':comment.content})
    
def delete_comment(request,cmt_id):
    comment = Comment.objects.get(id=cmt_id)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        comment.delete()
        return JsonResponse({})
    return HttpResponse()

def like_comment(request,cmt_id):
    comment = Comment.objects.get(id=cmt_id)
    like_filter = LikeComment.objects.filter(comment=comment,user=request.user).first()
    # if request.method == 'GET':
    #     return JsonResponse({'no_of_likes':comment.no_of_likes, 'liked':like_filter is not None})
    if request.method == 'POST':
        if like_filter is None:
            comment.no_of_likes += 1
            LikeComment.objects.create(comment=comment, user=request.user)
        else:
            comment.no_of_likes -= 1
            like_filter.delete()
        comment.save()
        return JsonResponse({'no_of_likes':comment.no_of_likes, 'liked':like_filter is None})
    
def get_sorted_comments(request,post_id, crit):
    if request.method == 'GET':
        post = Post.objects.get(id=post_id)
        if crit == 'time':
            comments = Comment.objects.filter(post=post).order_by('-created_at') # comments là QuerySet, không JSON serialiazalbe
        else: 
            comments = Comment.objects.filter(post=post).order_by('-no_of_likes','-created_at')
        # chuyển comments thành list các dict để có thể JSON serializable
        l = []
        for x in comments:
            cmt = {
                'id':x.id,
                'user':x.user.username,
                'content':x.content.replace('\n','<br>'),
                'created_at':x.created_at,
                'no_of_likes':x.no_of_likes,
                'liked': LikeComment.objects.filter(user=request.user,comment=x).first() is not None,
            }
            l.append(cmt)

        return JsonResponse({'comments':l})
    
def ext_vi_kws(text):
    with open('./static/vietnamese-stopwords.txt',encoding='utf-8') as file:
        stopwords = file.read().splitlines()
        
    # loại bỏ stopwords ra khỏi text trước khi xử lý
    rake = Rake(stopwords=stopwords, include_repeated_phrases=False)
    rake.extract_keywords_from_text(text)
    phr_no_stopwords = rake.get_ranked_phrases()
    kws = set()
    kw_tags = ['N','Ny','Np','M'] # N: danh từ, Ny: danh từ viết tắt, Np: tên riêng, M: số
    for phr in phr_no_stopwords:
        if len(phr.split()) > 4:
            tks = ViTokenizer.tokenize(text[text.lower().index(phr):text.lower().index(phr)+len(phr)]) # Chuyển câu thành các token từ
            pos_tags = ViPosTagger.postagging(tks) # gán từ loại cho các token
            # pos_tags[0]: danh sách từ, pos_tags[1]: danh sách pos tags
            for i in range(len(pos_tags[0])): 
                if pos_tags[1][i] in kw_tags:
                    kws.add(' '.join([w for w in pos_tags[0][i].split('_')]))
        else:
            pos_tag = ViPosTagger.postagging(phr)
            if pos_tag[1][0] in kw_tags:
                kws.add(phr)
    print(kws)
    return kws
def ext_en_kws(text):
    nlp = spacy.load("en_core_web_sm")
    kws = set()
    kws_tags = ['NOUN','NUM','PROPN'] # NOUN: danh từ, NUM: số, PROPN: tên riêng
    doc = nlp(text)
    for token in doc:
        if token.pos_ in kws_tags and not token.is_stop:
            kws.add(token.text)
    return kws

def recommend_posts(request):
    data = json.loads(request.body)
    subject = data.get('subject')
    caption = data.get('caption')
    title = data.get('title')
    print(caption, subject, title)
    kws = set()
    if title:
        if detect(title) == 'en':
            kws |= ext_en_kws(title)
        else:
            kws |= ext_vi_kws(title)
    if caption:
        if detect(caption) == 'en':
            kws |= ext_en_kws(caption)
        else:
            kws |= ext_vi_kws(caption)

    kws = list(kws)
    rec_posts = {}
    for kw in kws:
        posts = Post.objects.filter(Q(title__icontains=kw) | Q(caption__icontains=kw))
        
        for p in posts:
            occur_count = p.caption.count(kw) + p.title.count(kw)
            if p not in rec_posts:
                rec_posts[p] = [1,occur_count] # [a,b]: a là số từ khoá xuất hiện, b là số lần xuất hiện của tất cả từ khoá
            else:
                rec_posts[p][0] += 1
                rec_posts[p][1] += occur_count
    rec_posts = dict(sorted(rec_posts.items(), key=lambda x: (-x[1][0], -x[1][1])))
    same_sub, diff_sub = [],[]
    for post in rec_posts.keys():
        p = {
            'id':post.id,
            'title':post.title,
            'caption':post.caption,
            'subject':post.subject,
            'created_at':post.created_at,
            'user':post.user.username,
            'no_of_comments':post.no_of_comments,
        }
        if post.subject == subject:
            same_sub.append(p)
        else:
            diff_sub.append(p)
    return JsonResponse({'same_sub':same_sub, 'diff_sub':diff_sub})



