import factory
from .activity import ActivityFactory
from .prompt import PromptFactory
from ...models.activity import ActivityPrompt


class ActivityPromptFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ActivityPrompt

    activity = ActivityFactory()
    prompt = PromptFactory()
    order = 1
