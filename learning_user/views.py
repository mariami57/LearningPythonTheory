from django.contrib.auth import authenticate, login
from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from learning_user.models import LearningUser
from learning_user.serializers import LearningUserRegistrationSerializer


# Create your views here.
class RegisterView(CreateAPIView):
    serializer_class = LearningUserRegistrationSerializer
    queryset = LearningUser.objects.all()
    permission_classes = [AllowAny]

def register_view(request):
    return render(request, 'register.html')

class LoginView(APIView):

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({'message':'Invalid Credentials'},
                            status=status.HTTP_400_BAD_REQUEST
                 )
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response({'access':access})

        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=False,  # change to True before deploying
            samesite='Lax', # change to 'Strict' before deploying
            max_age=3600 * 7 * 24,
            path='/'
        )

        return response

def login_view(request):
    return render(request, 'login.html')

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token =request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({'error':'No refresh token'}, status=401)

        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200 and 'refresh' in response.data:
            response.set_cookie(
                key='refresh_token',
                value=response.data['refresh'],
                httponly=True,
                secure=False,  # change to True before deploying
                samesite='Lax',  # change to 'Strict' before deploying
                path='/'
            )
        return response

class LogoutView(APIView):
    def post(self,request):

        refresh = request.COOKIES.get('refresh_token')

        if refresh:
            token = RefreshToken(refresh)
            token.blacklist()

        response = Response({'message':'Successfully logged out'})
        response.delete_cookie('refresh_token', path='/')

        return response

def logout_view(request):
    return render(request, 'logout.html')