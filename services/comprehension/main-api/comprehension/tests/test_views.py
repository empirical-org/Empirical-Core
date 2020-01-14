from django.test import RequestFactory, TestCase

from ..models.activity import Activity
from ..views import index, show_activities


class ViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_index(self):
        request = self.factory.get('/')

        response = index(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content,
                         b'This could return something helpful!')


class ActivityViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        Activity.objects.create(title='Test Activity',
                                flag=Activity.FLAGS.DRAFT)

    def test_show_activities(self):
        request = self.factory.get('/activities')

        response = show_activities(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content,
                         b'There are 1 Activities in the DB')

class RegexRuleTest(TestCase):
    def setUp(self):
        self.regex_rule_set = RegexRuleSet.objects.create(prompt_id=0,
                                name='Test Rule Set',
                                feedback='Test feedback',
                                priority=1,
                                pass_order=Activity.FLAGS.FIRST)

    def test_name_not_nullable(self):
        self.regex_rule_set.title = None
        with self.assertRaises(ValidationError):
            self.regex_rule_set.save()

    def test_feedback_not_nullable(self):
        self.regex_rule_set.feedback = None
        with self.assertRaises(ValidationError):
            self.regex_rule_set.save()

    def test_priority_unique_on_prompt_id(self):
        self.regex_rule_set_2 = RegexRuleSet.objects.create(prompt_id=0,
                                    name='Test Rule Set Duplicate',
                                    feedback='Test feedback',
                                    priority=1,
                                    pass_order=Activity.PASS_ORDER.FIRST)
        with self.assertRaises(ValidationError):
            self.regex_rule_set_2.save()

    def test_pass_order_validation(self):
        self.regex_rule_set.pass_order = 'DEFINITELY NOT A VALID FLAG'
        with self.assertRaises(ValidationError):
            self.regex_rule_set.save()
