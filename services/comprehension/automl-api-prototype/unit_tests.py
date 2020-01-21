from unittest.mock import Mock, patch
import flask
import pytest
import main
from flask import json


# Create a fake "app" for generating test request contexts.
@pytest.fixture(scope="module")
def app():
    return flask.Flask(__name__)


def mock_response_for(label_dict):
    mock_response = Mock()
    payload = []

    for label, score in label_dict.items():
        mock = Mock(display_name=label, classification=Mock(score=score))
        payload.append(mock)

    mock_response.payload = payload

    return mock_response


@patch('google.cloud.automl_v1beta1.PredictionServiceClient')
def test_single_label_response(mock_automl, app):
    with app.test_request_context(json={'entry': 'something',
                                        'prompt_id': 35}):
        mock_return = mock_response_for({"outside_scope": 0.97})
        mock_automl.return_value.predict.return_value = mock_return

        response = main.response_endpoint(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data['optimal'] is False
        assert data['feedback'] == ("Your answer is outside the scope "
                                    "of this article. Use evidence from "
                                    "the passage to make your argument")


@patch('google.cloud.automl_v1beta1.PredictionServiceClient')
def test_single_label_no_model(mock_automl, app):
    with app.test_request_context(json={'entry': 'something',
                                        'prompt_id': 9999}):
        mock_return = mock_response_for({"outside_scope": 0.97})
        mock_automl.return_value.predict.return_value = mock_return

        response = main.response_endpoint(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 400
        assert data['feedback'] == "error: model not found"


@patch('google.cloud.automl_v1beta1.PredictionServiceClient')
def test_no_label_feedback(mock_automl, app):
    with app.test_request_context(json={'entry': 'something',
                                        'prompt_id': 35}):
        mock_return = mock_response_for({
            "some_random_key_that_doesnt_exist": 0.97
        })
        mock_automl.return_value.predict.return_value = mock_return

        response = main.response_endpoint(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data['optimal'] is False
        assert data['feedback'] == "Please read the passage and try again!"


@patch('google.cloud.automl_v1beta1.PredictionServiceClient')
def test_correct_feedback(mock_automl, app):
    with app.test_request_context(json={'entry': 'something',
                                        'prompt_id': 35}):
        mock_return = mock_response_for({"greenhouse_specifc": 0.97})
        mock_automl.return_value.predict.return_value = mock_return

        response = main.response_endpoint(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data['optimal'] is True
        assert data['feedback'] == 'You are correct! Well done!'


@patch('google.cloud.automl_v1beta1.PredictionServiceClient')
def test_single_label_response_no_entry(mock_automl, app):
    with app.test_request_context(json={}):
        mock_return = mock_response_for({"outside_scope": 0.97})
        mock_automl.return_value.predict.return_value = mock_return

        response = main.response_endpoint(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 400
        assert data['feedback'] == "error"


@patch('google.cloud.automl_v1beta1.PredictionServiceClient')
def test_multi_label_response(mock_automl, app):
    with app.test_request_context(json={'entry': 'something',
                                        'prompt_id': 98}):
        mock_return = mock_response_for({"Leaders": 0.97,
                                         "Feels_Represented": 0.51})
        mock_automl.return_value.predict.return_value = mock_return

        response = main.response_endpoint(flask.request)
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data['optimal'] is False
        expected_feedback = ("Rewrite your sentence. There's no evidence "
                             "in the passage that states that people will "
                             "feel more represented. Instead write a "
                             "sentence that states how people will be more "
                             "represented in government.")
        assert data['feedback'] == expected_feedback
