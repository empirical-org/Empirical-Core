import factory

from .prompt import PromptFactory
from ...models.ml_feedback import MLFeedback


class MLFeedbackFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MLFeedback

    combined_labels = MLFeedback.DEFAULT_FEEDBACK_LABEL
    feedback = 'Example feedback'
    optimal = False
    prompt = factory.SubFactory(PromptFactory)
    order = factory.Sequence(lambda x: x)
