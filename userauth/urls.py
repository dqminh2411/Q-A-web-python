from django.contrib import admin
from django.urls import path
from socialmedia import settings
from userauth import views
from django.conf.urls.static import static

urlpatterns = [
    path('',views.home),
    path('loginn/',views.loginn),
    path('signup/',views.signup),
    path('logoutt/',views.logoutt),
    path('upload',views.upload),
    path('like-post/<str:id>', views.likes, name='like-post'),
    path('#<str:id>', views.home_post),
    path('explore',views.explore),
    path('postdetail/<uuid:post_id>/', views.postdetail,name='postdetail'),

    path('profile/<str:id_user>', views.profile),
    # path('delete/<str:id>', views.delete),
    path('search-results/', views.search_results, name='search_results'),
    path('follow', views.follow, name='follow'),
    path('search/subject/', views.search_by_subject, name='search_by_subject'),
    path('post/update/<uuid:post_id>/', views.update_post, name='update-post'),
    path('post/delete/<uuid:post_id>/',views.delete_post, name='delete-post'),
    path('comment/edit/<int:cmt_id>/', views.edit_comment, name='edit-comment'),
    path('comment/delete/<int:cmt_id>/', views.delete_comment, name='delete-comment'),
    path('comment/like/<int:cmt_id>', views.like_comment, name='like-comment'),
    path('comment/sort/<uuid:post_id>/<str:crit>', views.get_sorted_comments),
    path('liked-posts/', views.liked_posts, name='liked-posts'),
    

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
