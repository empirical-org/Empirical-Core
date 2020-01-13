from django.db import models

from . import DjangoChoices


class RegexRuleSet(Model):
    class FLAGS(DjangoChoices):
        FIRST = 'first'
        SECOND = 'second'

    prompt_id = models.IntegerField(null=False)
    name = models.TextField(null=False)
    feedback = models.TextField(null=False)
    pass_order = models.TextField(null=False, choices=FLAGS.get_for_choices())

    def __str__(self):
        return self.name

class Rule(Model):
    regex_text = models.TextField(null=False)
    regex_rule_set = models.ForeignKey(RegexRuleSet, on_delete=models.CASCADE)

    def __str__(self):
        return "%s: %s" % (self.regex_rule_set, self.regex_text)