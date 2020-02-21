import factory
from .rule_set import RuleSetFactory
from ...models.rule import Rule


class RuleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Rule

    regex_text = '^test'
    rule_set = factory.SubFactory(RuleSetFactory)
    case_sensitive = False
