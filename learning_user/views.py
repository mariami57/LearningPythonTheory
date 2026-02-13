from django.contrib.auth import authenticate, login
from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from learning_user.serializers import LearningUserRegistrationSerializer


# Create your views here.
class RegisterView(CreateAPIView):
    serializer_class = LearningUserRegistrationSerializer

def register_view(request):
    return render(request, 'register.html')

class LoginView(APIView):

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({'message':'Logged in successfully'})
        else:
            return Response({'message':'Invalid Credentials'},
                            status=status.HTTP_400_BAD_REQUEST
                            )

