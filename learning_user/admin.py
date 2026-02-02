from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from learning_user.forms import LearningUserCreationForm

# Register your models here.

UserModel = get_user_model()

@admin.register(UserModel)
class UserModelAdmin(UserAdmin):
    list_display = ['username', 'email']
    add_form = LearningUserCreationForm

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (("Personal info"), {"fields": ("email", )}),
        (
            ("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (("Important dates"), {"fields": ("last_login", )}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2"),
            },
        ),
    )