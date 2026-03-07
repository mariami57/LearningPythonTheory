from django.urls import path
from django.contrib.auth import views as auth_views
from learning_user.views import RegisterView, register_view, login_view, CookieTokenRefreshView, logout_view, LoginView, \
    LogoutView

urlpatterns = [
    path('register-api/', RegisterView.as_view(), name='register'),
    path('register/', register_view, name='register_page'),
    path('login/', login_view, name='login_page'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('login-api/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),

]