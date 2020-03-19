from unittest.mock import patch

from django.test import RequestFactory, TestCase
from django.urls import reverse

from ..factories.feedback_history import FeedbackHistoryFactory
from ..factories.user import UserFactory
from ...views.session_feedback_history import SessionFeedbackHistoryView


class TestSessionFeedbackHistoryView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch('comprehension.views.session_feedback_history.render')
    def test_get_feedback_history(self, mock_render):
        feedback_history1 = FeedbackHistoryFactory()
        # Create a second FeedbackHistory record with the same session_id
        # to confirm that aggregation works as expected and only the earliest
        # one gets put into context
        FeedbackHistoryFactory(session_id=feedback_history1.session_id)
        request = self.factory.get(reverse('get_session_feedback_history'))
        request.user = UserFactory(is_staff=True)

        expected_context = {
            'sessions': [{
                'session_id': feedback_history1.session_id,
                'created_at': feedback_history1.created_at,
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
