from django.urls import path

from learning_user.views import RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(),name='register'),

]