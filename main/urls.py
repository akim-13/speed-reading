from django.urls import path
from . import views

urlpatterns = [
    path('', views.fov_trainer, name='fov_trainer'),
    #path('register/', views.register_view, name='register'),
]
