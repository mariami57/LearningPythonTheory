import json

from django.core.management import BaseCommand
from django.db import transaction

from closed_choice.models import ClosedChoice
from question.models import Question
from topic.models import Topic


class Command(BaseCommand):
    help = 'Import questions and choices from a JSON file'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str)

    @transaction.atomic
    def handle(self, *args, **options):
        file_path = options['file_path']

        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        topic = Topic.objects.get(pk=data['topic_id'])

        for q_data in  data['questions']:
            question, _ = Question.objects.get_or_create(
                topic=topic,
                text=q_data['text'],
                question_type=q_data['question_type'],
                difficulty=q_data.get('difficulty', 1),
            )

            if q_data.get('question_type') == Question.CLOSED:
                for choice in q_data.get('choices', []):
                    ClosedChoice.objects.get_or_create(
                        question_id=question.id,
                        text=choice["text"],
                        defaults={
                            "is_correct": choice.get("is_correct", False)
                        }
                    )

        self.stdout.write(self.style.SUCCESS('Successfully imported questions'))