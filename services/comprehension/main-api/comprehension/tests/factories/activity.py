import factory
from ...models.activity import Activity
from ...models.prompt import Prompt


class ActivityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Activity

    title = 'Test title'
    flag = Activity.FLAGS.DRAFT
