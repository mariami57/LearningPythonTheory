from django.urls import path, include

from topic.views import TopicViewList, topic_page
from useranswer.views import SubmitAllAnswersView, submit_page, TopicQuestionSet

urlpatterns = [
    path('all-topics/', topic_page, name='all_topics'),
    path('topics-api/', TopicViewList.as_view(), name='topics_list'),
    path('<int:pk>/', include([
        path('questions/', TopicQuestionSet.as_view(), name='question_set'),
        path('quiz/', submit_page, name='submit_page'),
        path('submit/', SubmitAllAnswersView.as_view(), name='submit_answer'),
    ]))

]