import factory
from .ml_model import MLModelFactory
from ...models.prompt import Prompt


class PromptFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Prompt

    text = 'Test prompt text'
    max_attempts = 5
    max_attempts_feedback = 'Too many attempts'
    ml_model = factory.SubFactory(MLModelFactory)

    @factory.post_generation
    def rule_sets(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            for rule_set in extracted:
                self.rule_sets.add(rule_set)
