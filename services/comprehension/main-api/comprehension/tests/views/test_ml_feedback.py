import json
from unittest.mock import patch

from django.http import Http404
from django.test import RequestFactory, TestCase
from django.urls import reverse

from ..factories.ml_feedback import MLFeedbackFactory
from ..factories.prompt import PromptFactory
from ..mocks.google_auto_ml import generate_auto_ml_label_response_mock
from ...models.ml_model import MLModel
from ...views.feedback_ml_multi import MultiLabelMLFeedbackView
from ...views.feedback_ml_single import SingleLabelMLFeedbackView
from ...utils import construct_feedback_payload


def mock_google_auto_ml_response(*args, **kwargs):
    return [
        generate_auto_ml_label_response_mock(score=0.1, label='Lowest'),
        generate_auto_ml_label_response_mock(score=0.6, label='Middle'),
        generate_auto_ml_label_response_mock(score=0.9, label='Highest'),
    ]


@patch.object(MLModel, '_request_google_auto_ml_response',
              mock_google_auto_ml_response)
class TestMLFeedbackView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.prompt = PromptFactory()
        self.fb_single = MLFeedbackFactory(combined_labels='Highest',
                                           prompt=self.prompt,
                                           feedback='Single label feedback')
        self.fb_multi = MLFeedbackFactory(combined_labels='Highest_Middle',
                                          prompt=self.prompt,
                                          feedback='Multi label feedback')
        self.request_body = {
            'prompt_id': self.prompt.id,
            'entry': 'SAMPLE ENTRY',
        }

    def test_get_single_label_ml_feedback(self):
        request = self.factory.post(reverse('get_single_label_ml_feedback'),
                                    data=json.dumps(self.request_body),
                                    content_type='application/json')

        response = SingleLabelMLFeedbackView().post(request)
        json_body = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        expected = construct_feedback_payload(self.fb_single.feedback,
                                              'auto_ml_semantic',
                                              self.fb_single.optimal)

        self.assertEqual(json_body, expected)

    def test_get_single_label_ml_feedback_404(self):
        request_body = {
            'prompt_id': '10000000',
            'entry': 'Prompt does not exist',
        }
        request = self.factory.post(reverse('get_single_label_ml_feedback'),
                                    data=json.dumps(request_body),
                                    content_type='application/json')

        with self.assertRaises(Http404):
            SingleLabelMLFeedbackView.as_view()(request)

    def test_get_multi_label_ml_feedback(self):
        request = self.factory.post(reverse('get_multi_label_ml_feedback'),
                                    data=json.dumps(self.request_body),
                                    content_type='application/json')

        response = MultiLabelMLFeedbackView().post(request)
        json_body = json.loads(response.content)

        expected = construct_feedback_payload(self.fb_multi.feedback,
                                              'auto_ml_semantic',
                                              self.fb_multi.optimal)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_body, expected)

    def test_get_multi_label_ml_feedback_404(self):
        request_body = {
            'prompt_id': '10000000',
            'entry': 'Prompt does not exist',
        }
        request = self.factory.post(reverse('get_multi_label_ml_feedback'),
                                    data=json.dumps(request_body),
                                    content_type='application/json')

        with self.assertRaises(Http404):
            MultiLabelMLFeedbackView.as_view()(request)
