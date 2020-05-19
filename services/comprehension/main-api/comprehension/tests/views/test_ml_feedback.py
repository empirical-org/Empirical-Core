import json
from unittest.mock import patch

from django.http import Http404
from django.test import RequestFactory, TestCase
from django.urls import reverse

from ..factories.highlight import HighlightFactory
from ..factories.ml_feedback import MLFeedbackFactory
from ..factories.prompt import PromptFactory
from ...models.prompt import Prompt
from ...models.prompt_entry import PromptEntry
from ...views.ml_feedback import MLFeedbackView
from ...views.ml_feedback import FEEDBACK_TYPE
from ...utils import construct_feedback_payload
from ...utils import construct_highlight_payload


@patch.object(Prompt, 'fetch_auto_ml_feedback')
class TestMLFeedbackView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.prompt = PromptFactory()
        self.fb_single = MLFeedbackFactory(combined_labels='Highest',
                                           prompt=self.prompt,
                                           feedback='Single label feedback')
        self.fb = MLFeedbackFactory(combined_labels='Highest_Middle',
                                    prompt=self.prompt,
                                    feedback='Multi label feedback')
        self.request_body = {
            'prompt_id': self.prompt.id,
            'entry': 'SAMPLE ENTRY',
        }

    def test_get_ml_feedback_404(self, fetch_feedback_mock):
        request_body = {
            'prompt_id': '10000000',
            'entry': 'Prompt does not exist',
        }
        request = self.factory.post(reverse('get_ml_feedback'),
                                    data=json.dumps(request_body),
                                    content_type='application/json')

        with self.assertRaises(Http404):
            MLFeedbackView.as_view()(request)

    def test_error_message_when_missing_default(self, fetch_feedback_mock):
        fetch_feedback_mock.side_effect = Prompt.NoDefaultMLFeedbackError()
        request = self.factory.post(reverse('get_ml_feedback'),
                                    data=json.dumps(self.request_body),
                                    content_type='application/json')

        response = MLFeedbackView().post(request)
        json_body = json.loads(response.content)

        msg = f'No default feedback defined for Prompt {self.prompt.id}'
        expected = {'message': msg}

        self.assertEqual(response.status_code, 500)
        self.assertEqual(json_body, expected)

    def test_ml_feedback(self, fetch_feedback_mock):
        fetch_feedback_mock.return_value = self.fb
        request = self.factory.post(reverse('get_ml_feedback'),
                                    data=json.dumps(self.request_body),
                                    content_type='application/json')

        response = MLFeedbackView().post(request)
        json_body = json.loads(response.content)

        expected = construct_feedback_payload(
            self.fb.feedback,
            FEEDBACK_TYPE,
            self.fb.optimal,
            self.fb.id,
            labels=self.fb.combined_labels
        )

        fetch_feedback_mock.assert_called_with(self.request_body['entry'], [])
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_body, expected)

    def test_previous_feedback(self, fetch_feedback_mock):
        self.request_body['previous_feedback'] = ['some feedback objects']
        fetch_feedback_mock.return_value = self.fb
        request = self.factory.post(reverse('get_ml_feedback'),
                                    data=json.dumps(self.request_body),
                                    content_type='application/json')

        response = MLFeedbackView().post(request)

        fetch_feedback_mock.assert_called_with(
            self.request_body['entry'],
            self.request_body['previous_feedback'])
        self.assertEqual(response.status_code, 200)

    def test_highlights_in_payload(self, fetch_feedback_mock):
        fetch_feedback_mock.return_value = self.fb
        highlight = HighlightFactory(feedback=self.fb)
        request = self.factory.post(reverse('get_ml_feedback'),
                                    data=json.dumps(self.request_body),
                                    content_type='application/json')

        response = MLFeedbackView().post(request)
        json_body = json.loads(response.content)

        highlight_payload = construct_highlight_payload(
            highlight_type=highlight.highlight_type,
            highlight_text=highlight.highlight_text,
            highlight_id=highlight.id
        )
        expected = construct_feedback_payload(
            self.fb.feedback,
            FEEDBACK_TYPE,
            self.fb.optimal,
            self.fb.id,
            labels=self.fb.combined_labels,
            highlight=[highlight_payload],
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_body, expected)

    def test_record_prompt_entry(self, fetch_feedback_mock):
        request = self.factory.post(reverse('get_ml_feedback'),
                                    data=json.dumps(self.request_body),
                                    content_type='application/json')

        self.assertEqual(PromptEntry.objects.count(), 0)

        response = MLFeedbackView().post(request)

        self.assertEqual(PromptEntry.objects.count(), 1)

    def test_no_errors_on_duplicate_prompt_entry(self, fetch_feedback_mock):
        request = self.factory.post(reverse('get_ml_feedback'),
                                    data=json.dumps(self.request_body),
                                    content_type='application/json')

        self.assertEqual(PromptEntry.objects.count(), 0)

        MLFeedbackView().post(request)

        self.assertEqual(PromptEntry.objects.count(), 1)

        response = MLFeedbackView().post(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(PromptEntry.objects.count(), 1)
