from django.urls import path

from learning_user.views import RegisterView, register_view

urlpatterns = [
    path('register-api/', RegisterView.as_view(), name='register'),
    path('register/', register_view, name='register_page'),

]