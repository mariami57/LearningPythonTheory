from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from learning_user.models import LearningUser, UserProfile

UserModel = get_user_model()

class LearningUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)


    class Meta:
        model = UserModel
        fields = ('email', 'username', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        password = validated_data.pop('password')

        with transaction.atomic():
            user = LearningUser.objects.create_user(
                password=password,
                **validated_data)

            UserProfile.objects.create(
                learning_user=user,
                first_name=first_name,
                last_name=last_name)

            return user