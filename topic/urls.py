from django.urls import path, include

from topic.views import TopicViewList, TopicQuestionSet
from useranswer.views import SubmitAnswerView, answer_test_page

urlpatterns = [
    path('all-topics/', TopicViewList.as_view(), name='all_topics'),
    path('<int:pk>/', include([
        path('questions/', TopicQuestionSet.as_view(), name='question_set'),

        # HTML test page
        path('answer_page/', answer_test_page, name='answer-page'),

        # DRF API endpoint for submitting answers
        path('answer/', SubmitAnswerView.as_view(), name='submit-answer'),
        ]),
    ),

]