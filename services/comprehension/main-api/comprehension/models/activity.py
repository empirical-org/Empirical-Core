from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from . import DjangoChoices, TimestampedModel
from .passage import Passage
from .prompt import Prompt
from .rule_set import RuleSet


class Activity(TimestampedModel):
    class FLAGS(DjangoChoices):
        ALPHA = 'alpha'
        BETA = 'beta'
        PRODUCTION = 'production'
        ARCHIVED = 'archived'

    title = models.TextField(null=False)
    flag = models.TextField(null=False, choices=FLAGS.get_for_choices(),
                            default=FLAGS.ALPHA)
    target_reading_level = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(4), MaxValueValidator(12)]
    )
    scored_reading_level = models.TextField(null=True, blank=True)
    passages = models.ManyToManyField(Passage, through='ActivityPassage',
                                      related_name='activities')
    prompts = models.ManyToManyField(Prompt, through='ActivityPrompt',
                                     related_name='activities')

    def get_passages(self):
        return list(self.passages.order_by('activitypassage__order').all())

    def get_prompts(self):
        return list(self.prompts.order_by('activityprompt__order').all())

    # TODO: Move this function to be a @classmethod of the RuleSet model
    # instead of being here
    def get_next_priority(self):
        rule_sets = RuleSet.objects.filter(prompt__in=self.prompts.all())
        if not rule_sets:
            return 0
        return rule_sets.latest('priority').priority + 1


class ActivityPassage(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    passage = models.ForeignKey(Passage, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)


class ActivityPrompt(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
