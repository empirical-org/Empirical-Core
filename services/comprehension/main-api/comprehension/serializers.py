from rest_framework import serializers
from .models.activity import Activity, ActivityPassage, ActivityPrompt
from .models.passage import Passage
from .models.prompt import Prompt

#class ActivitySerializer(serializers.HyperlinkedModelSerializer):
class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'title']

    def create(self, validated_data):
        return Activity.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.update(**validated_data)
        instance.save()
        return instance

class PassageSerializer(serializers.ModelSerializer):
    activity_passage = ActivitySerializer(read_only=True)

    class Meta:
        #model = Passage
        model = ActivityPassage
        fields = ['text']

class PromptSerializer(serializers.ModelSerializer):
    activity_passage = ActivitySerializer(read_only=True, many=True)

    class Meta:
        #model = Prompt
        model = ActivityPrompt
        fields = ['id', 'text', 'max_attempts', 'max_attempts_feedback']
