import csv

from io import StringIO
from unittest.mock import call, MagicMock, patch

from django.test import TestCase

from ....views.plagiarism import PlagiarismFeedbackView
from ....management.commands import pre_filter_responses

Command = pre_filter_responses.Command


class TestCommandBase(TestCase):
    def setUp(self):
        self.command = Command()


class TestPreFilterResponsesCommand(TestCommandBase):
    def test_add_arguments(self):
        mock_parser = MagicMock()
        self.command.add_arguments(mock_parser)

        self.assertEqual(mock_parser.add_argument.call_count, 2)
        mock_parser.assert_has_calls([
            call.add_argument('passage_source', metavar='PASSAGE_SOURCE',
                              help='The path to the file with the passage'),
            call.add_argument('csv_input', metavar='CSV_PATH',
                              help='The path to the input CSV file'),
        ])

    @patch.object(PlagiarismFeedbackView, '_check_is_plagiarism')
    @patch.object(Command, '_retrieve_passage')
    @patch.object(csv, 'reader')
    @patch.object(csv, 'writer')
    @patch(f'{pre_filter_responses.__name__}.open')
    def test_extract_create_feedback_kwargs(self, mock_open, mock_writer,
                                            mock_reader, mock_retrieve,
                                            mock_check_plagiarism):
        mock_csv_input = 'MOCK_CSV_INPUT'
        kwargs = {
            'passage_source': 'MOCK_PASSAGE_SOURCE',
            'csv_input': mock_csv_input,
        }
        file_name = 'FAKE FILE NAME'
        mock_handler = mock_open.return_value
        mock_file_content = StringIO('HEADER\nVALUE')
        mock_handler.__enter__.return_value = mock_file_content

        mock_reader_row = 'MOCK_ROW'
        mock_reader.next.return_value = mock_reader_row

        mock_check_plagiarism.return_value = False

        self.command.handle(**kwargs)

        mock_open.assert_has_calls([
            call(mock_csv_input, 'r'),
            call().__enter__(),
            call(f'filtered_{mock_csv_input}', 'w'),
            call().__enter__(),
            call().__exit__(None, None, None),
            call().__exit__(None, None, None),
        ])

        mock_retrieve.assert_called_with(kwargs['passage_source'])

        mock_writer.assert_called()
