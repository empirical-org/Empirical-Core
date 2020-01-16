from unittest.mock import Mock, patch

from django.test import TestCase
from google.cloud import automl_v1beta1 as automl

from ..factories.ml_model import MLModelFactory
from ..mocks.google_auto_ml import generate_auto_ml_label_response_mock
from ...models.ml_model import MLModel


class TestAutoMLModel(TestCase):
    def setUp(self):
        self.ml_model = MLModelFactory()


class TestAutoMLModelRelevancyFilter(TestAutoMLModel):
    def setUp(self):
        super().setUp()
        self.auto_ml_labels = [
            generate_auto_ml_label_response_mock(score=0.01),
            generate_auto_ml_label_response_mock(score=0.2),
            generate_auto_ml_label_response_mock(score=0.4),
            generate_auto_ml_label_response_mock(score=0.6),
            generate_auto_ml_label_response_mock(score=0.8),
            generate_auto_ml_label_response_mock(score=0.99),
        ]

    def test_filter_for_relevant_labels(self):
        labels = self.ml_model._filter_for_relevant_labels(self.auto_ml_labels)
        scores = list(map(lambda x: x.classification.score, labels))
        self.assertEqual(scores, [0.6, 0.8, 0.99])

    def test_custom_threshold(self):
        labels = self.ml_model._filter_for_relevant_labels(self.auto_ml_labels,
                                                           threshold=0.9)
        scores = list(map(lambda x: x.classification.score, labels))
        self.assertEqual(scores, [0.99])


class TestAutoMLModelLabeling(TestAutoMLModel):
    def setUp(self):
        super().setUp()
        self.auto_ml_labels = [
            generate_auto_ml_label_response_mock(score=0.1, label='Lowest'),
            generate_auto_ml_label_response_mock(score=0.6, label='Middle'),
            generate_auto_ml_label_response_mock(score=0.9, label='Highest'),
        ]

    @patch.object(MLModel, '_request_google_auto_ml_label')
    def test_request_single_label(self, request_mock):
        entry = 'foo'
        self.ml_model.request_single_label(entry)
        self.assertTrue(request_mock.called_with(entry))

    @patch.object(MLModel, '_request_google_auto_ml_response')
    def test_request_google_auto_ml_label(self, google_request_mock):
        google_request_mock.return_value = self.auto_ml_labels
        label = self.ml_model._request_google_auto_ml_label(None)
        self.assertEqual(label, ['Highest'])

    @patch.object(MLModel, '_request_google_auto_ml_labels')
    def test_request_labels(self, request_mock):
        entry = 'foo'
        self.ml_model.request_labels(entry)
        self.assertTrue(request_mock.called_with(entry))

    @patch.object(MLModel, '_request_google_auto_ml_response')
    def test_request_google_auto_ml_labels(self, google_request_mock):
        google_request_mock.return_value = self.auto_ml_labels
        label = self.ml_model._request_google_auto_ml_labels(None)
        self.assertEqual(label, ['Middle', 'Highest'])

    @patch.object(automl, 'PredictionServiceClient')
    def test_request_google_auto_ml_response(self, client_mock):
        payload_mock = Mock()
        client_instance = Mock()
        client_instance.predict = Mock()
        client_instance.predict.return_value = payload_mock
        client_mock.return_value = client_instance

        expected_url = 'projects/{}/locations/{}/models/{}'.format(
            self.ml_model.project_id,
            self.ml_model.compute_region,
            self.ml_model.model_id)
        sample_entry = 'ENTRY'
        expected_payload = {'text_snippet': {
            'content': sample_entry,
            'mime_type': 'text/plain',
        }}

        self.ml_model._request_google_auto_ml_response(sample_entry)
        self.assertTrue(client_mock.called)
        self.assertTrue(client_instance.called_with(expected_url,
                                                    expected_payload,
                                                    {}))
