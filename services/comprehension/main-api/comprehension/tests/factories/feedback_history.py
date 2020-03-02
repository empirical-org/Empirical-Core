import factory

from .prompt import PromptFactory
from ...models.feedback_history import FeedbackHistory


class FeedbackHistoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FeedbackHistory

    attempt = 1
    entry = 'Mock user-provided entry.'
    feedback = {
        'foo': 'bar',
        'baz': 'qux',
    }
    feedback_optimal = False
    feedback_text = 'Example feedback'
    feedback_type = 'test'
    prompt = factory.SubFactory(PromptFactory)
    session_id = 'MOCK_SESSION_ID'
