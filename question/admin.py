from django.contrib import admin
from question.models import Question, ClosedChoice


# Register your models here.

class ChoiceInline(admin.TabularInline):
    model = ClosedChoice
    extra = 4

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline]
    list_display = ("text", "topic", "question_type")
