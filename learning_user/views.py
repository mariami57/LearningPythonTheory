from django.contrib.auth import authenticate, login
from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

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
            secure=True,
            samesite='Strict',
            max_age=3600 * 7 * 24
        )

        return response

def login_view(request):
    return render(request, 'login.html')