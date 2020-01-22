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
