import factory
from ...models.passage import Passage


class PassageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Passage

    text = 'Test passage text'
