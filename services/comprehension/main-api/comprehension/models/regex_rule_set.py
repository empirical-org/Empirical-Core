from django.db import models

from . import DjangoChoices
import re


class RegexRuleSet(models.Model):
    class PASS_ORDER(DjangoChoices):
        FIRST = 'first'
        SECOND = 'second'

    prompt_id = models.IntegerField(null=False)
    name = models.TextField(null=False)
    feedback = models.TextField(null=False)
    priority = models.IntegerField(null=False, default=1)
    pass_order = models.TextField(null=False, choices=PASS_ORDER.get_for_choices())

    class Meta:
        unique_together = ('prompt_id', 'priority','pass_order',)

    def __str__(self):
        return self.name



class Rule(models.Model):
    regex_text = models.TextField(null=False)
    regex_rule_set = models.ForeignKey(RegexRuleSet, on_delete=models.CASCADE)

    def __str__(self):
        return "%s: %s" % (self.regex_rule_set, self.regex_text)

    def match(self, entry):
        return not re.search(self.regex_text, entry)


def get_rules_based_feedback_first_pass(request):
    request_json = request.get_json()

    entry = request_json.get('entry')
    prompt_id = request_json.get('prompt_id')

    if entry == None or prompt_id == None:
        return make_response(jsonify(message="error"), 400)

    regex_rule_set_list = Prompt.regex_rule_set_set.get(
                    pass_order=RegexRuleSet.PASS_ORDER.FIRST)
                    .order_by('priority')

    response_data = {
        'feedback_type': 'rules-based',
        'response_uid': 'q23123@3sdfASDF',
        'feedback': 'All rules-based checks passed!',
        'optimal': True,
        'highlight': []
    }

    for regex_rule_set in regex_rule_set_list:
        for rule in regex_rule_set.rule_set:
            if not rule.match(entry):
                response_data.update({
                    'feedback': regex_rule_set.feedback
                    'optimal': False
                })
                return response_data

    return response_data




