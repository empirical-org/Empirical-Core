from rest_framework import serializers
from django.shortcuts import get_object_or_404, get_list_or_404

from .models.activity import Activity, ActivityPassage, ActivityPrompt
from .models.passage import Passage
from .models.prompt import Prompt
from .models.rule_set import RuleSet
from .models.rule import Rule


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
        fields = ['id', 'title', 'target_reading_level', 'flag',
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


class RulePromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ['id', 'conjunction']
        read_only_fields = ['id', 'conjunction']


class RuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rule
        fields = ['id', 'regex_text', 'case_sensitive']
        read_only_fields = ['id']

    def validate(self, data):
        activities_pk = self.context["view"].kwargs["activities_pk"]
        get_object_or_404(Activity, pk=activities_pk)
        return data

    def create(self, validated_data):
        rule_set_pk = self.context["view"].kwargs["rulesets_pk"]
        validated_data['rule_set'] = get_object_or_404(RuleSet, pk=rule_set_pk)

        instance = Rule(**validated_data)
        instance.save()

        return instance

    def update(self, instance, validated_data):
        rule_set_pk = self.context["view"].kwargs["rulesets_pk"]
        rule_set = get_object_or_404(RuleSet, pk=rule_set_pk)
        if instance not in rule_set.rules.all():
            raise serializers.ValidationError(f'Rule {instance.id} does not'
                                              'belong to RuleSet'
                                              f'{rule_set.id}')

        Rule.objects.filter(pk=instance.pk).update(**validated_data)
        instance.refresh_from_db()

        return instance


class RuleSetListSerializer(serializers.ModelSerializer):
    rules = RuleSerializer(many=True, required=False)
    prompts = RulePromptSerializer(source='prompt_set',
                                   many=True,
                                   required=False)

    class Meta:
        model = RuleSet
        fields = ['id', 'name', 'rules', 'prompts']
        read_only_fields = ['id']


class RuleSetViewSerializer(serializers.ModelSerializer):
    rules = RuleSerializer(many=True, read_only=True)
    prompts = RulePromptSerializer(source='prompt_set',
                                   many=True,
                                   read_only=True)
    prompt_ids = serializers.ListField(write_only=True)

    class Meta:
        model = RuleSet
        fields = ['id', 'name', 'feedback', 'rules', 'prompts', 'prompt_ids']
        read_only_fields = ['id', 'rules', 'prompts']

    def validate_prompt_ids(self, prompt_ids):
        if len(prompt_ids) == 0:
            raise serializers.ValidationError('You added no prompts, which '
                                              'will make this rule set '
                                              'unreachable. '
                                              'Either include a '
                                              'prompt ID or delete this '
                                              'rule set.'
                                              )
        activities_pk = self.context["view"].kwargs["activities_pk"]
        get_list_or_404(Prompt, pk__in=prompt_ids)
        prompts = (Prompt.objects
                         .filter(pk__in=prompt_ids,
                                 activities=activities_pk)
                         .count())
        if prompts != len(prompt_ids):
            raise serializers.ValidationError(f'Your prompt IDs {prompt_ids} '
                                              'do not match the prompts on '
                                              'this activity.')
        return prompt_ids

    def validate(self, data):
        activities_pk = self.context["view"].kwargs["activities_pk"]
        get_object_or_404(Activity, pk=activities_pk)
        return data

    def create(self, validated_data):
        prompt_ids = validated_data.pop('prompt_ids', None)
        activities_pk = self.context["view"].kwargs["activities_pk"]
        activity = get_object_or_404(Activity, pk=activities_pk)

        validated_data['priority'] = \
            (RuleSet.get_next_rule_set_priority_for_activity(activity))

        instance = RuleSet(**validated_data)
        instance.save()

        instance.prompt_set.set(prompt_ids)

        return instance

    def update(self, instance, validated_data):
        prompt_ids = validated_data.pop('prompt_ids')

        RuleSet.objects.filter(pk=instance.pk).update(**validated_data)
        instance.refresh_from_db()

        instance.prompt_set.set(prompt_ids)

        return instance
