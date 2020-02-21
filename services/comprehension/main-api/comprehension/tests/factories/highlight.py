import factory

from .ml_feedback import MLFeedbackFactory
from ...models.highlight import Highlight


class HighlightFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Highlight

    feedback = factory.SubFactory(MLFeedbackFactory)
    highlight_text = 'Highlight me'
    highlight_type = Highlight.TYPES.PASSAGE
