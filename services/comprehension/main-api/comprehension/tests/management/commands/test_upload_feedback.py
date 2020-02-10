from io import StringIO
from unittest.mock import call, MagicMock, patch

from django.test import TestCase

from ....management.commands import upload_feedback
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

    @patch.object(MLFeedback.objects, 'create')
    @patch.object(Command, '_extract_create_feedback_kwargs')
    @patch.object(Command, '_drop_existing_feedback_records')
    def test_handle(self, mock_drop, mock_extract, mock_create):
        kwargs = {
            'prompt_id': 'MOCK_PROMPT_ID',
            'csv_input': 'MOCK_CSV_INPUT',
        }
        mock_create_kwargs = {'foo': 'bar'}
        mock_extract.return_value = [mock_create_kwargs]

        self.command.handle(**kwargs)

        mock_drop.assert_called()
        mock_extract.assert_called_with(kwargs['csv_input'])
        mock_create_kwargs.update({
            'prompt_id': kwargs['prompt_id'],
        })
        mock_create.assert_called_with(**mock_create_kwargs)

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
        }

    def test_process_csv_row(self):
        self.assertEqual(self.command._process_csv_row(self.row), {
            'combined_labels': self.row[Command.COMBINED_LABELS_HEADER],
            'optimal': False,
            'feedback': self.row[Command.FEEDBACK_HEADER],
            'order': self.row[Command.FEEDBACK_ORDER_HEADER],
        })

    def test_process_csv_row_optimal(self):
        self.row[Command.OPTIMAL_HEADER] = 'Yes'
        result = self.command._process_csv_row(self.row)
        self.assertTrue(result['optimal'])

    def test_process_csv_row_no_labels(self):
        del self.row[Command.COMBINED_LABELS_HEADER]
        self.assertIsNone(self.command._process_csv_row(self.row))

    def test_process_csv_row_no_feedback(self):
        del self.row[Command.FEEDBACK_HEADER]
        self.assertIsNone(self.command._process_csv_row(self.row))
