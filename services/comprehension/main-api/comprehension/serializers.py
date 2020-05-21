from rest_framework import serializers
from .models.activity import Activity, ActivityPassage, ActivityPrompt
from .models.passage import Passage
from .models.prompt import Prompt
from .models.turking_round import TurkingRound


class PassageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passage
        fields = ['id', 'text']
        read_only_fields = ['id']


class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ['id', 'text', 'max_attempts', 'max_attempts_feedback',
                  'conjunction']
        read_only_fields = ['id', 'conjunction']


class ActivitySerializer(serializers.ModelSerializer):
    passages = PassageSerializer(many=True)
    prompts = PromptSerializer(many=True)

    class Meta:
        model = Activity
        fields = ['id', 'title', 'target_reading_level',
                  'scored_reading_level', 'passages', 'prompts']
        read_only_fields = ['id']

    def create(self, validated_data):
        passages = validated_data.pop('passages', None)
        prompts = validated_data.pop('prompts', None)

        instance = Activity(**validated_data)
        instance.save()

        self._update_passages(passages, instance)
        self._update_prompts(prompts, instance)

        return instance

    def update(self, instance, validated_data):
        passages = validated_data.pop('passages', None)
        prompts = validated_data.pop('prompts', None)

        Activity.objects.filter(pk=instance.pk).update(**validated_data)
        instance.refresh_from_db()

        self._update_passages(passages, instance)
        self._update_prompts(prompts, instance)

        return instance

    def _update_passages(self, passages, parent_activity):
        serializer = PassageSerializer()
        existing_passages = parent_activity.get_passages()
        for i, passage_data in enumerate(passages):
            try:
                update_passage = existing_passages[i]
            except IndexError:
                new_passage = serializer.create(passage_data)
                ActivityPassage(
                    activity=parent_activity,
                    passage=new_passage,
                    order=i
                ).save()
            else:
                serializer.update(update_passage, passage_data)

    def _update_prompts(self, prompts, parent_activity):
        serializer = PromptSerializer()
        existing_prompts = parent_activity.get_prompts()
        for i, prompt_data in enumerate(prompts):
            try:
                update_prompt = existing_prompts[i]
            except IndexError:
                new_prompt = serializer.create(prompt_data)
                ActivityPrompt(
                    activity=parent_activity,
                    prompt=new_prompt,
                    order=i
                ).save()
            else:
                serializer.update(update_prompt, prompt_data)


class ActivityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'title']
        read_only_fields = ['id']


class TurkingRoundSerializer(serializers.ModelSerializer):
    activity_id = serializers.PrimaryKeyRelatedField(
        source='activity',
        queryset=Activity.objects.all())

    class Meta:
        model = TurkingRound
        fields = ['id', 'activity_id', 'expires_at', 'expired']
        read_only_fields = ['id', 'expired']
