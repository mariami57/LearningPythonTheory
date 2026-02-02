from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from learning_user.managers import LearningUserManager


# Create your models here.
class LearningUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(unique=True, max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = LearningUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username


class UserProfile(models.Model):
    learning_user = models.OneToOneField(LearningUser, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)


    @property
    def full_name(self):
        full_name =  f'{self.first_name} {self.last_name}'
        return full_name if full_name else ''
