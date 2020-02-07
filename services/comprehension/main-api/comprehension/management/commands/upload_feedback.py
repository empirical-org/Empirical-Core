from csv import DictReader

from django.core.management.base import BaseCommand

from ...models.ml_feedback import MLFeedback


class Command(BaseCommand):
    help = 'Parses a CSV for feedback records'

    COMBINED_LABELS_HEADER = 'Combined Labels'
    OPTIMAL_HEADER = 'Optimal'
    FEEDBACK_HEADER = 'Feedback'
    FEEDBACK_ORDER_HEADER = 'Feedback Order'

    def add_arguments(self, parser):
        parser.add_argument('prompt_id', metavar='PROMPT_ID',
                            help='The database ID of the prompt')
        parser.add_argument('csv_input', metavar='CSV_PATH',
                            help='The path to the input CSV file')

    def handle(self, *args, **kwargs):
        prompt_id = kwargs['prompt_id']
        csv_input = kwargs['csv_input']

        self._drop_existing_feedback_records(prompt_id)

        for feedback_kwargs in self._extract_create_feedback_kwargs(csv_input):
            feedback_kwargs.update({
                'prompt_id': prompt_id,
            })
            MLFeedback.objects.create(**feedback_kwargs)

    def _extract_create_feedback_kwargs(self, csv_input):
        with open(csv_input) as csvfile:
            data = DictReader(csvfile)
            for row in data:
                result = self._process_csv_row(row)
                if not result:
                    continue
                yield result

    def _process_csv_row(self, row):
        combined_labels = row.get(self.COMBINED_LABELS_HEADER)
        optimal = 'y' in row.get(self.OPTIMAL_HEADER, '').lower()
        feedback = row.get(self.FEEDBACK_HEADER)
        feedback_order = row.get(self.FEEDBACK_ORDER_HEADER, 1)

        if not (combined_labels and feedback):
            return None

        return {
            'combined_labels': combined_labels,
            'optimal': optimal,
            'feedback': feedback,
            'order': feedback_order,
        }

    def _drop_existing_feedback_records(self, prompt_id):
        MLFeedback.objects.filter(prompt_id=prompt_id).delete()
