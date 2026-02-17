from rest_framework.pagination import PageNumberPagination

class FiveQuestionPagination(PageNumberPagination):
    page_size = 5