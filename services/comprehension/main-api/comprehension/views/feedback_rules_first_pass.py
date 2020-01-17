import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from . import ApiView
from ..models.prompt import Prompt
from ..models.rule_set import RuleSet


class RulesBasedFeedbackFirstPassView(ApiView):
    def post(self, request):
        submission = json.loads(request.body)
        prompt_id = submission['prompt_id']
        entry = submission['entry']

        prompt = get_object_or_404(Prompt, pk=prompt_id)
        feedback = prompt.fetch_rules_based_feedback(entry,
                                                     RuleSet.PASS_ORDER.FIRST)

        return JsonResponse(feedback)
