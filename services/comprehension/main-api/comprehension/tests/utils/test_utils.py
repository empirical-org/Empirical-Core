from functools import reduce
from unittest import TestCase

from ...utils import combine_labels
from ...utils import construct_feedback_payload
from ...utils import construct_highlight_payload


class TestCombineLabels(TestCase):
    def setUp(self):
        self.labels = ['First', 'Second', 'Third', 'Fourth']
        self.result = combine_labels(self.labels)

    def test_underscore_join(self):
        underscore_count = reduce(lambda x, y: x + int(y == '-'),
                                  self.result, 0)

        self.assertEqual(underscore_count, len(self.labels) - 1)

    def test_sort_labels(self):
        re_split_labels = self.result.split('-')

        self.assertEqual(sorted(self.labels), re_split_labels)


class TestConstructFeedbackPayload(TestCase):
    def setUp(self):
        self.feedback = 'FEEDBACK'
        self.feedback_id = 'FEEDBACK_ID'
        self.feedback_type = 'FEEDBACK_TYPE'
        self.optimal = 'OPTIMAL'

    def test_payload_format_default_highlight(self):
        result = construct_feedback_payload(self.feedback,
                                            self.feedback_type,
                                            self.optimal,
                                            self.feedback_id)
        self.assertEqual(result, {
            'feedback': self.feedback,
            'feedback_type': self.feedback_type,
            'optimal': self.optimal,
            'response_id': self.feedback_id,
            'highlight': [],
        })

    def test_payload_format_with(self):
        highlight = ['placeholder for real structure']
        result = construct_feedback_payload(self.feedback,
                                            self.feedback_type,
                                            self.optimal,
                                            self.feedback_id,
                                            highlight=highlight)
        self.assertEqual(result, {
            'feedback': self.feedback,
            'feedback_type': self.feedback_type,
            'optimal': self.optimal,
            'response_id': self.feedback_id,
            'highlight': highlight,
        })


class TestConstructHighlightPayload(TestCase):
    def setUp(self):
        self.highlight_type = 'TYPE'
        self.highlight_text = 'TEXT'

    def test_payload_format_with_defaults(self):
        result = construct_highlight_payload(self.highlight_type,
                                             self.highlight_text)
        self.assertEqual(result, {
            'type': self.highlight_type,
            'id': None,
            'text': self.highlight_text,
            'category': None,
            'character': 0,
        })

    def test_payload_format_with_character(self):
        character = 10
        result = construct_highlight_payload(self.highlight_type,
                                             self.highlight_text,
                                             start_index=character)
        self.assertEqual(result, {
            'type': self.highlight_type,
            'id': None,
            'text': self.highlight_text,
            'category': None,
            'character': character,
        })

    def test_payload_format_with_id(self):
        highlight_id = 1
        result = construct_highlight_payload(self.highlight_type,
                                             self.highlight_text,
                                             highlight_id=highlight_id)
        self.assertEqual(result, {
            'type': self.highlight_type,
            'id': highlight_id,
            'text': self.highlight_text,
            'category': None,
            'character': 0,
        })
