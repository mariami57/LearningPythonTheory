from django.contrib import admin

from question.models import Question
from topic.models import Topic


# Register your models here.
class QuestionInline(admin.TabularInline):
    model = Question
    extra = 3
    fields = ['text', 'question_type']



@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]