from rest_framework.generics import CreateAPIView
from learning_user.serializers import LearningUserRegistrationSerializer


# Create your views here.
class RegisterView(CreateAPIView):
    serializer_class = LearningUserRegistrationSerializer

