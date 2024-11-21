from django.db import models
from django.contrib.auth import get_user_model
import uuid
from datetime import datetime

User = get_user_model()

# Create your models here.
class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,primary_key=True)
    bio = models.TextField(blank=True, default='')
    profileimg = models.ImageField(upload_to='profile_images', default='blank-profile-picture.png')
    location = models.CharField(max_length=100, blank=True, default='')
    

    def __str__(self):
        return self.user.username

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User,to_field='username',on_delete=models.CASCADE)
    title = models.TextField(default='')
    file = models.FileField(upload_to='uploads/', null=True, blank=True)  # Sử dụng FileField cho tất cả loại file
    caption = models.TextField(default='')
    subject = models.CharField(max_length=50,default='')
    created_at = models.DateTimeField(default=datetime.now)
    no_of_likes = models.IntegerField(default=0)

    def __str__(self):
        return self.title
    @property
    def no_of_comments(self):
        return self.comments.all().count()

class LikePost(models.Model):
    # set null = True để không cần thiết lập giá trị mặc định do ta luôn có post,user khi tạo LikePost
    post = models.ForeignKey(Post,on_delete=models.CASCADE,null=True)
    user = models.ForeignKey(User,to_field='username',on_delete=models.CASCADE,null=True)

    def __str__(self):
        if self.post and self.user:
            return self.user.username + " liked " + self.post.title
        return ''

class Followers(models.Model):
    follower = models.ForeignKey(User,related_name='following',to_field='username',on_delete=models.CASCADE)
    user = models.ForeignKey(User,related_name='followed_by',to_field='username',on_delete=models.CASCADE)
    def __str__(self):
        return self.user.username + " followed by " + self.follower.username

class Comment(models.Model):
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='comments',to_field='username',on_delete=models.CASCADE)
    content = models.TextField(default='')
    created_at = models.DateTimeField(default=datetime.now)
    no_of_likes = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.user.username} commented on {self.post.title}"
    
class LikeComment(models.Model):
    # đặt null = True để ko phải đặt default value do khi like comment ta luôn có 2 giá trị của 2 thuộc tính
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE,null=True)
    # comment_id = models.IntegerField(null=False)
    user = models.ForeignKey(User,to_field='username',on_delete=models.CASCADE,null=True)

    def __str__(self):
        if self.comment and self.user:
            return self.user.username + " liked " + self.comment.content
        return ''
    
