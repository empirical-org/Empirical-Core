from unittest.mock import patch

from django.test import RequestFactory, TestCase
from django.urls import reverse

from ..factories.feedback_history import FeedbackHistoryFactory
from ..factories.prompt import PromptFactory
from ..factories.user import UserFactory
from ...views.session_feedback_history import SessionFeedbackHistoryView


class TestSessionFeedbackHistoryView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch('comprehension.views.session_feedback_history.render')
    def test_get_feedback_history(self, mock_render):
        prompt1 = PromptFactory(id=5)
        prompt2 = PromptFactory(id=1)
        fb1 = FeedbackHistoryFactory(attempt=1, prompt=prompt1)
        # Create a second FeedbackHistory record with the same session_id
        # to confirm that aggregation works as expected and only the earliest
        # one gets put into context
        fb2 = FeedbackHistoryFactory(session_id=fb1.session_id,
                                     prompt=prompt2,
                                     attempt=2)
        request = self.factory.get(reverse('get_session_feedback_history'))
        request.user = UserFactory(is_staff=True)

        prompt_ids = ', '.join(str(id) for id in
                               sorted([prompt1.id, prompt2.id]))
        expected_context = {
            'sessions': [{
                'session_id': fb1.session_id,
                'created_at': fb1.created_at,
                'attempts': fb2.attempt,
                'prompt_ids': prompt_ids,
            }]
        }

        SessionFeedbackHistoryView().get(request)

        mock_render.assert_called_with(request,
                                       'session_feedback_history.html',
                                       expected_context)

    def test_only_staff_can_access(self):
        request = self.factory.get(reverse('get_session_feedback_history'))
        request.user = UserFactory(is_staff=False)

        response = SessionFeedbackHistoryView().get(request)

        self.assertEqual(response.status_code, 302)
