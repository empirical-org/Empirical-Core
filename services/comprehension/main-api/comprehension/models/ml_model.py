from django.db import models
from google.cloud import automl_v1beta1 as automl

from . import TimestampedModel


class MLModel(TimestampedModel):
    RELEVANCY_THRESHOLD = 0.5

    project_id = models.TextField(null=False)
    compute_region = models.TextField(null=False)
    model_id = models.TextField(null=False)

    def request_single_label(self, entry):
        return self._request_google_auto_ml_label(entry)

    def request_labels(self, entry):
        return self._request_google_auto_ml_labels(entry)

    def _request_google_auto_ml_label(self, entry):
        response = self._request_google_auto_ml_response(entry)
        ordered = sorted(response, key=lambda x: x.classification.score,
                         reverse=True)
        return [ordered[0].display_name]

    def _request_google_auto_ml_labels(self, entry):
        response = self._request_google_auto_ml_response(entry)
        relevant = self._filter_for_relevant_labels(response)
        return [label.display_name for label in relevant]

    def _request_google_auto_ml_response(self, entry):
        url = 'projects/{}/locations/{}/models/{}'.format(
            self.project_id,
            self.compute_region,
            self.model_id)
        payload = {'text_snippet': {
            'content': entry,
            'mime_type': 'text/plain',
        }}

        client = automl.PredictionServiceClient()
        return client.predict(url, payload, {}).payload

    def _filter_for_relevant_labels(self, labels, threshold=RELEVANCY_THRESHOLD):
        return filter(lambda x: x.classification.score > threshold, labels)
