from django.core.exceptions import ValidationError
from django.test import TestCase

from ..factories.prompt import PromptFactory
from ..factories.prompt_entry import PromptEntryFactory
from ...models.prompt_entry import PromptEntry


class PromptEntryModelTest(TestCase):
    def test_entry_not_nullable(self):
        prompt = PromptFactory()
        prompt_entry = PromptEntry(prompt=prompt)
        with self.assertRaises(ValidationError):
            prompt_entry.full_clean()

    def test_prompt_not_nullable(self):
        entry = 'TEST ENTRY'
        prompt_entry = PromptEntry(entry=entry)
        with self.assertRaises(ValidationError):
            prompt_entry.full_clean()

    def test_write_once(self):
        prompt_entry = PromptEntryFactory()
        prompt_entry.entry = 'NEW TEST ENTRY'
        with self.assertRaises(PromptEntry.ModelUpdateNotAllowedError):
            prompt_entry.save()
