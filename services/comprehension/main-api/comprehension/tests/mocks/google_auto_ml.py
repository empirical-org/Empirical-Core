from unittest.mock import Mock


def generate_auto_ml_label_response_mock(score=0.6, label=''):
    mock = Mock()
    mock.classification = Mock()
    mock.classification.score = score
    mock.display_name = label
    return mock
