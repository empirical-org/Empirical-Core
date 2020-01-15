from functools import reduce
from unittest import TestCase

from ...utils import combine_labels, construct_feedback_payload


class TestCombineLabels(TestCase):
    def setUp(self):
        self.labels = ['First', 'Second', 'Third', 'Fourth']
        self.result = combine_labels(self.labels)

    def test_underscore_join(self):
        underscore_count = reduce(lambda x, y: x + int(y == '_'), self.result, 0)

        self.assertEqual(underscore_count, len(self.labels) - 1)

    def test_sort_labels(self):
        re_split_labels = self.result.split('_')

        self.assertEqual(sorted(self.labels), re_split_labels)


class TestConstructFeedbackPayload(TestCase):
    def test_payload_format(self):
        feedback = 'FEEDBACK'
        feedback_type = 'FEEDBACK_TYPE'
        optimal = 'OPTIMAL'
        result = construct_feedback_payload(feedback, feedback_type, optimal)
        self.assertEqual(result, {
            'feedback': feedback,
            'feedback_type': feedback_type,
            'optimal': optimal,
            'response_id': 'PLACEHOLDER',
            'highlight': [],
        })
