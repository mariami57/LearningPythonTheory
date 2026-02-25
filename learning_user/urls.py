from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from learning_user.views import RegisterView, register_view, LoginView, login_view

urlpatterns = [
    path('register-api/', RegisterView.as_view(), name='register'),
    path('register/', register_view, name='register_page'),
    # path('login-api/', LoginView.as_view(), name='login'),
    path('login/', login_view, name='login_page'),
    path('login-api/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]