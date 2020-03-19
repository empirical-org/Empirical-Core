from unittest.mock import patch

from django.test import RequestFactory, TestCase
from django.urls import reverse

from ..factories.feedback_history import FeedbackHistoryFactory
from ..factories.user import UserFactory
from ...views.session_feedback_history_detail import (
    SessionFeedbackHistoryDetailView
)


class TestSessionFeedbackHistoryDetailView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch('comprehension.views.session_feedback_history_detail.render')
    def test_get_feedback_history_detail(self, mock_render):
        mock_session_id = 'MOCK_SESSION_ID'
        feedback_history1 = FeedbackHistoryFactory(session_id=mock_session_id)
        feedback_history2 = FeedbackHistoryFactory(session_id=mock_session_id)
        feedback_history3 = FeedbackHistoryFactory(session_id=mock_session_id)
        url = reverse('get_session_feedback_history_detail',
                      kwargs={'session_id': mock_session_id})
        request = self.factory.get(url)
        request.user = UserFactory(is_staff=True)

        ordered_history = [
            feedback_history1,
            feedback_history2,
            feedback_history3,
        ]
        expected_context = {
            'session_id': mock_session_id,
            'feedback': [{
                'prompt_text': fh.prompt.text,
                'attempt': fh.attempt,
                'entry': fh.entry,
                'feedback_text': fh.feedback_text,
                'feedback_type': fh.feedback_type,
            } for fh in ordered_history]
        }

        SessionFeedbackHistoryDetailView().get(request, mock_session_id)

        mock_render.assert_called_with(request,
                                       'session_feedback_history_detail.html',
                                       expected_context)

    def test_only_staff_can_access(self):
        request = self.factory.get(reverse('get_session_feedback_history'))
        request.user = UserFactory(is_staff=False)

        response = SessionFeedbackHistoryDetailView().get(request)

        self.assertEqual(response.status_code, 302)
