import factory
from .activity import ActivityFactory
from .passage import PassageFactory
from ...models.activity import ActivityPassage
from ...models.prompt import Prompt


class ActivityPassageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ActivityPassage

    activity = ActivityFactory()
    passage = PassageFactory()
    order = 1
