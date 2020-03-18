from unittest.mock import patch

from django.test import RequestFactory, TestCase
from django.urls import reverse

from ..factories.feedback_history import FeedbackHistoryFactory
from ...views.session_feedback_history_detail import (
    SessionFeedbackHistoryDetailView
)


class TestSessionFeedbackHistoryView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch('comprehension.views.session_feedback_history_detail.render')
    def test_post_feedback_history(self, mock_render):
        mock_session_id = 'MOCK_SESSION_ID'
        feedback_history1 = FeedbackHistoryFactory(session_id=mock_session_id)
        feedback_history2 = FeedbackHistoryFactory(session_id=mock_session_id)
        feedback_history3 = FeedbackHistoryFactory(session_id=mock_session_id)
        url = reverse('get_session_feedback_history_detail',
                      kwargs={'session_id': mock_session_id})
        request = self.factory.get(url)

        ordered_history = [
            feedback_history1,
            feedback_history2,
            feedback_history3,
        ]
        expected_context = {
            'feedback': [{
                'session_id': fh.session_id,
                'prompt_text': fh.prompt.text,
                'entry': fh.entry,
                'feedback_text': fh.feedback_text,
                'feedback_type': fh.feedback_type,
            } for fh in ordered_history]
        }

        SessionFeedbackHistoryDetailView().get(request, mock_session_id)

        mock_render.assert_called_with(request,
                                       'session_feedback_history_detail.html',
                                       expected_context)
