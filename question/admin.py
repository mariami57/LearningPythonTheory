from django.contrib import admin

from closed_choice.models import ClosedChoice
from question.models import Question


# Register your models here.

class ChoiceInline(admin.TabularInline):
    model = ClosedChoice
    extra = 4

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline]
    list_display = ("text", "topic", "question_type")
