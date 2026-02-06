from django.urls import path, include

from topic.views import TopicViewList, TopicQuestionSet
from useranswer.views import SubmitAllAnswersView, submit_page

urlpatterns = [
    path('all-topics/', TopicViewList.as_view(), name='all_topics'),
    path('<int:pk>/', include([
        path('questions/', TopicQuestionSet.as_view(), name='question_set'),
        path('quiz/', submit_page, name='submit_page'),
        path('submit/', SubmitAllAnswersView.as_view(), name='submit_answer'),
    ]))

]