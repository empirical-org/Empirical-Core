from unittest.mock import patch

from django.test import TestCase

from ..utils import combine_labels

class TestCombineLabels(TestCase):

    def test_combine_labels(self):
        labels = ['Comprehension', 'Accuracy', 'Foo']
        self.assertEqual(combine_labels(labels),
                         'Accuracy_Comprehension_Foo')
