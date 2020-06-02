import factory
from .prompt import PromptFactory
from ...models.prompt_entry import PromptEntry


class PromptEntryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PromptEntry

    entry = 'Test entry text'
    prompt = factory.SubFactory(PromptFactory)
