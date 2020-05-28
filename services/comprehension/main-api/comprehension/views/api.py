from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

from ..models.activity import Activity
from ..models.rule_set import RuleSet
from ..models.rule import Rule
from ..models.turking_round import TurkingRound
from ..serializers import (ActivitySerializer,
                           ActivityListSerializer,
                           RuleSetViewSerializer,
                           RuleSetCreateUpdateSerializer,
                           RuleSetListSerializer,
                           RuleSerializer,
                           TurkingRoundSerializer)


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows activities to be viewed or edited.
    """
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Activity.objects.all().order_by('created_at')

    def get_serializer_class(self):
        if self.action == 'list':
            return ActivityListSerializer
        return ActivitySerializer


class RuleSetViewSet(viewsets.ModelViewSet):
    serializer_class = RuleSetCreateUpdateSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        activity = get_object_or_404(Activity, pk=self.kwargs['activities_pk'])
        prompts = activity.prompts.all()
        return (RuleSet.objects
                       .filter(prompt__in=prompts)
                       .order_by('priority')
                       .distinct())

    def list(self, request, activities_pk=None, format='json'):
        serializer = RuleSetListSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, activities_pk=None, format='json'):
        get_object_or_404(Activity, pk=activities_pk)
        rule_set = get_object_or_404(RuleSet, pk=pk)
        serializer = RuleSetViewSerializer(rule_set, many=False)
        return Response(serializer.data)


    @action(detail=False, methods=['put'])
    def order(self, request, activities_pk=None, format='json'):
        order_list = request.data['rulesetIDs']
        if not order_list or len(order_list) != len(self.get_queryset()):
            raise ValidationError('Your list of rule set IDs does not'
                                  'match the rule sets belonging to activity'
                                  f'{activities_pk}')

        if not all(isinstance(s, int) for s in order_list):
            raise ValidationError('Please provide a list of integers'
                                  'for prompt ids.')

        for i, rule_set_id in enumerate(order_list):
            rule_set = get_object_or_404(RuleSet, pk=rule_set_id)
            if rule_set not in self.get_queryset():
                raise ValidationError(f'Rule set {rule_set_id} does not'
                                      f'belong to activity {activities_pk}.')
            rule_set.priority = i
            rule_set.save()

        serializer = RuleSetListSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)


class RuleViewSet(viewsets.ModelViewSet):
    serializer_class = RuleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        get_object_or_404(Activity, pk=self.kwargs['activities_pk'])

        rule_set = get_object_or_404(RuleSet, pk=self.kwargs['rulesets_pk'])
        return Rule.objects.filter(rule_set=rule_set)


class TurkingRoundViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows activities to be viewed or edited.
    """
    queryset = TurkingRound.objects.all().order_by('created_at')
    serializer_class = TurkingRoundSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
