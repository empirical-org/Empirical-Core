import factory
from .prompt import PromptFactory
from ...models.rule_set import RuleSet


class RuleSetFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = RuleSet

    prompt = factory.SubFactory(PromptFactory)
    name = 'Test rule set name'
    feedback = 'Test feedback'
    priority = 1
    pass_order = RuleSet.PASS_ORDER.FIRST