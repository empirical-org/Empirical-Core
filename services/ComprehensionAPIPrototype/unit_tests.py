from unittest.mock import Mock, patch
import flask
import pytest
import main
from flask import json


# Create a fake "app" for generating test request contexts.
@pytest.fixture(scope="module")
def app():
    return flask.Flask(__name__)

def test_single_label_response(app):
    with app.test_request_context(json={'entry': 'something', 'prompt_id': 35}):
      with patch('google.cloud.automl_v1beta1.PredictionServiceClient') as mock_automl:

        mock_response = Mock()
        mock_response.payload = [
          Mock(display_name="outside_scope", classification=Mock(score=0.97))
        ]
        mock_automl.return_value.predict.return_value = mock_response

        response = main.response_endpoint(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data['message'] == "Your answer is outside the scope of this article. Use evidence from the passage to make your argument"

def test_single_label_no_model(app):
    with app.test_request_context(json={'entry': 'something', 'prompt_id': 9999}):
      with patch('google.cloud.automl_v1beta1.PredictionServiceClient') as mock_automl:

        mock_response = Mock()
        mock_response.payload = [
          Mock(display_name="outside_scope", classification=Mock(score=0.97))
        ]
        mock_automl.return_value.predict.return_value = mock_response

        response = main.response_endpoint(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 400
        assert data['message'] == "error: model not found"


def test_single_label_response_no_entry(app):
    with app.test_request_context(json={}):
      with patch('google.cloud.automl_v1beta1.PredictionServiceClient') as mock_automl:

        mock_response = Mock()
        mock_response.payload = [
          Mock(display_name="outside_scope", classification=Mock(score=0.97))
        ]
        mock_automl.return_value.predict.return_value = mock_response

        response = main.response_endpoint(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 400
        assert data['message'] == "error"

def test_multi_label_response(app):
    with app.test_request_context(json={'entry': 'something', 'prompt_id': 98}):
      with patch('google.cloud.automl_v1beta1.PredictionServiceClient') as mock_automl:

        mock_response = Mock()
        mock_response.payload = [
          Mock(display_name="Leaders", classification=Mock(score=0.97)),
          Mock(display_name="Feels_Represented", classification=Mock(score=0.51))
        ]
        mock_automl.return_value.predict.return_value = mock_response

        response = main.response_endpoint(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data['message'] == "Rewrite your sentence. There's no evidence in the passage that states that people will feel more represented. Instead write a sentence that states how people will be more represented in government."

