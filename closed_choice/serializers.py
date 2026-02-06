from rest_framework import serializers

from closed_choice.models import ClosedChoice


class ClosedChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClosedChoice
        fields = ['id', 'text', 'is_correct']