from django.conf import settings

from useranswer.services.evaluators import KeywordEvaluator


def get_evaluator():
    mode = getattr(settings, 'EVALUATOR_MODE', 'keyword')

    if mode == 'keyword':
        return KeywordEvaluator()


    # future:
    # if mode == "ai":
    #     return AIEvaluator()

    raise ValueError(f'Unknown evaluation mode: {mode}')