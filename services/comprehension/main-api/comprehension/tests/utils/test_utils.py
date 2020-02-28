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
        self.optimal = True

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

    def test_payload_format_with_highlight(self):
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

    def test_type_casting(self):
        result = construct_feedback_payload(1,
                                            2,
                                            0,
                                            3,
                                            highlight='thing',
                                            labels=1)
        self.assertEqual(type(result['feedback']), str)
        self.assertEqual(type(result['feedback_type']), str)
        self.assertEqual(type(result['optimal']), bool)
        self.assertEqual(type(result['response_id']), str)
        self.assertEqual(type(result['highlight']), list)
        self.assertEqual(type(result['labels']), str)


class TestConstructHighlightPayload(TestCase):
    def setUp(self):
        self.highlight_type = 'TYPE'
        self.highlight_text = 'TEXT'
        self.highlight_id = 1

    def test_payload_format_with_defaults(self):
        result = construct_highlight_payload(self.highlight_type,
                                             self.highlight_text,
                                             self.highlight_id)
        self.assertEqual(result, {
            'type': self.highlight_type,
            'id': self.highlight_id,
            'text': self.highlight_text,
            'category': '',
            'character': 0,
        })

    def test_payload_format_with_character(self):
        character = 10
        result = construct_highlight_payload(self.highlight_type,
                                             self.highlight_text,
                                             self.highlight_id,
                                             start_index=character)
        self.assertEqual(result, {
            'type': self.highlight_type,
            'id': self.highlight_id,
            'text': self.highlight_text,
            'category': '',
            'character': character,
        })

    def test_type_casting(self):
        result = construct_highlight_payload(1,
                                             1,
                                             start_index="0",
                                             highlight_id="1")
        self.assertEqual(type(result['type']), str)
        self.assertEqual(type(result['id']), int)
        self.assertEqual(type(result['text']), str)
        self.assertEqual(type(result['category']), str)
        self.assertEqual(type(result['character']), int)
