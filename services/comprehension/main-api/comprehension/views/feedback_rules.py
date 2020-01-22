import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from . import ApiView
from ..models.prompt import Prompt
from ..models.rule_set import RuleSet
from ..utils import construct_feedback_payload


class RulesBasedFeedbackView(ApiView):
    pass_order = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get_object(self, queryset=None):
        return queryset.get(pass_order=self.pass_order)

    def post(self, request):
        submission = json.loads(request.body)
        prompt_id = submission['prompt_id']
        entry = submission['entry']

        prompt = get_object_or_404(Prompt, pk=prompt_id)
        feedback = prompt.fetch_rules_based_feedback(entry,
                                                     self.pass_order)

        return JsonResponse(construct_feedback_payload(feedback['feedback'],
                                                       'rules-based',
                                                       feedback['optimal']))