from io import StringIO
from unittest.mock import call, MagicMock, patch

from django.test import TestCase

from ....management.commands import upload_feedback
from ....models.highlight import Highlight
from ....models.ml_feedback import MLFeedback

Command = upload_feedback.Command


class TestUploadFeedbackCommandBase(TestCase):
    def setUp(self):
        self.command = Command()


class TestUploadFeedbackCommand(TestUploadFeedbackCommandBase):
    def test_add_arguments(self):
        mock_parser = MagicMock()
        self.command.add_arguments(mock_parser)

        self.assertEqual(mock_parser.add_argument.call_count, 2)
        mock_parser.assert_has_calls([
            call.add_argument('prompt_id', metavar='PROMPT_ID',
                              help='The database ID of the prompt'),
            call.add_argument('csv_input', metavar='CSV_PATH',
                              help='The path to the input CSV file'),
        ])

    @patch.object(Command, '_create_records')
    @patch.object(Command, '_extract_create_feedback_kwargs')
    @patch.object(Command, '_drop_existing_feedback_records')
    def test_handle(self, mock_drop, mock_extract, mock_create):
        kwargs = {
            'prompt_id': 'MOCK_PROMPT_ID',
            'csv_input': 'MOCK_CSV_INPUT',
        }
        feedback_kwargs = {'foo': 'bar'}
        highlight_kwargs = {'baz': 'qux'}
        mock_create_kwargs = {
            Command.FEEDBACK_KEY: feedback_kwargs,
            Command.HIGHLIGHT_KEY: highlight_kwargs,
        }
        mock_extract.return_value = [mock_create_kwargs]

        self.command.handle(**kwargs)

        mock_drop.assert_called()
        mock_extract.assert_called_with(kwargs['csv_input'])
        mock_create_kwargs[Command.FEEDBACK_KEY].update({
            'prompt_id': kwargs['prompt_id'],
        })
        mock_create.assert_called_with(feedback_kwargs, highlight_kwargs)

    @patch.object(Highlight.objects, 'create')
    @patch.object(MLFeedback.objects, 'create')
    def test_create_records(self, mock_feedback_create,
                            mock_highlight_create):
        feedback_kwargs = {'foo': 'bar'}
        highlight_kwargs = {'baz': 'qux'}
        self.command._create_records(feedback_kwargs, highlight_kwargs)
        mock_feedback_create.assert_called_with(**feedback_kwargs)
        mock_highlight_create.assert_called_with(**highlight_kwargs)

    @patch.object(Highlight.objects, 'create')
    @patch.object(MLFeedback.objects, 'create')
    def test_create_records_no_highlight(self, mock_feedback_create,
                                         mock_highlight_create):
        feedback_kwargs = {'foo': 'bar'}
        highlight_kwargs = None
        self.command._create_records(feedback_kwargs, highlight_kwargs)
        mock_feedback_create.assert_called()
        mock_highlight_create.assert_not_called()

    @patch.object(Command, '_process_csv_row')
    @patch(f'{upload_feedback.__name__}.open')
    def test_extract_create_feedback_kwargs(self, mock_open, mock_process):
        file_name = 'FAKE FILE NAME'
        mock_handler = mock_open.return_value
        mock_file_content = StringIO('HEADER\nVALUE')
        mock_handler.__enter__.return_value = mock_file_content

        # This function is a generator, so we need to process all
        # iterations, and list() is a quick way to do so
        list(self.command._extract_create_feedback_kwargs(file_name))

        mock_open.assert_called_with(file_name)
        mock_process.assert_called_with({'HEADER': 'VALUE'})

    @patch.object(MLFeedback.objects, 'filter')
    def test_drop_existing_feedback_records(self, mock_mlmodel_filter):
        mock_prompt_id = 'FOO'

        self.command._drop_existing_feedback_records(mock_prompt_id)

        mock_mlmodel_filter.assert_called_with(prompt_id=mock_prompt_id)
        mock_mlmodel_filter.return_value.delete.assert_called()


class TestUploadFeedbackProcessCsvRow(TestUploadFeedbackCommandBase):
    def setUp(self):
        super().setUp()
        self.row = {
            Command.COMBINED_LABELS_HEADER: 'Label1-Label2',
            Command.OPTIMAL_HEADER: 'no',
            Command.FEEDBACK_HEADER: 'Feedback goes here',
            Command.FEEDBACK_ORDER_HEADER: 1,
            Command.HIGHLIGHT_TEXT_HEADER: 'goes here',
            Command.HIGHLIGHT_SKIP_HEADER: '8',
        }

    def test_process_csv_row(self):
        result = self.command._process_csv_row(self.row)
        self.assertEqual(result[Command.FEEDBACK_KEY], {
            'combined_labels': self.row[Command.COMBINED_LABELS_HEADER],
            'optimal': False,
            'feedback': self.row[Command.FEEDBACK_HEADER],
            'order': self.row[Command.FEEDBACK_ORDER_HEADER],
        })

    def test_process_csv_row_optimal(self):
        self.row[Command.OPTIMAL_HEADER] = 'Yes'
        result = self.command._process_csv_row(self.row)
        self.assertTrue(result[Command.FEEDBACK_KEY]['optimal'])

    def test_process_csv_row_no_labels(self):
        del self.row[Command.COMBINED_LABELS_HEADER]
        result = self.command._process_csv_row(self.row)
        self.assertIsNone(result[Command.FEEDBACK_KEY])

    def test_process_csv_row_no_feedback(self):
        del self.row[Command.FEEDBACK_HEADER]
        result = self.command._process_csv_row(self.row)
        self.assertIsNone(result[Command.FEEDBACK_KEY])

    def test_process_csv_row_highlight(self):
        result = self.command._process_csv_row(self.row)
        self.assertEqual(result[Command.HIGHLIGHT_KEY], {
            'highlight_text': self.row[Command.HIGHLIGHT_TEXT_HEADER],
            'start_index': self.row[Command.HIGHLIGHT_SKIP_HEADER],
        })

    def test_process_csv_row_for_highlight_no_text(self):
        self.row[Command.HIGHLIGHT_TEXT_HEADER] = ""
        result = self.command._process_csv_row(self.row)
        self.assertIsNone(result[Command.HIGHLIGHT_KEY])

    def test_process_csv_row_for_highlight_default_skip(self):
        del self.row[Command.HIGHLIGHT_SKIP_HEADER]
        result = self.command._process_csv_row(self.row)
        self.assertEqual(result[Command.HIGHLIGHT_KEY]['start_index'], 0)
