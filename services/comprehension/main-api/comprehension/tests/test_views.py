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
