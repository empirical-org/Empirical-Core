import factory

from .prompt import PromptFactory
from ...models.ml_feedback import MLFeedback


class MLFeedbackFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MLFeedback

    feedback = 'Example feedback'
    combined_labels = MLFeedback.DEFAULT_FEEDBACK_LABEL
    prompt = factory.SubFactory(PromptFactory)
