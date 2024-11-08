from django.db import models
from django.contrib.auth import get_user_model
import uuid
from datetime import datetime

User = get_user_model()

# Create your models here.
class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id_user = models.IntegerField(primary_key=True, default=0)
    bio = models.TextField(blank=True, default='')
    profileimg = models.ImageField(upload_to='profile_images', default='blank-profile-picture.png')
    location = models.CharField(max_length=100, blank=True, default='')
    

    def __str__(self):
        return self.user.username

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.CharField(max_length=100)
    title = models.TextField(null=True, blank=True)
    file = models.FileField(upload_to='uploads/', null=True, blank=True)  # Sử dụng FileField cho tất cả loại file
    caption = models.TextField()
    subject = models.CharField(max_length=50, default="HDT")
    created_at = models.DateTimeField(default=datetime.now)
    no_of_likes = models.IntegerField(default=0)

    def __str__(self):
        return self.user

class LikePost(models.Model):
    post_id = models.CharField(max_length=500)
    username = models.CharField(max_length=100)

    def __str__(self):
        return self.username + " liked " + self.post_id

class Followers(models.Model):
    follower = models.CharField(max_length=100)
    user = models.CharField(max_length=100)
    def __str__(self):
        return self.user

class Comment(models.Model):
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    user = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(default=datetime.now)
    no_of_likes = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.user} commented on {self.post.title}"
    
class LikeComment(models.Model):
    comment_id = models.IntegerField(null=False)
    username = models.CharField(max_length=100)

    def __str__(self):
        return self.username + " liked " + self.comment_id
    
