from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from learning_user.serializers import LearningUserRegistrationSerializer


# Create your views here.
class RegisterView(CreateAPIView):
    serializer_class = LearningUserRegistrationSerializer

def register_view(request):
    return render(request, 'log_in.html')