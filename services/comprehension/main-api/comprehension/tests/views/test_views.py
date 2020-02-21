from django.test import RequestFactory, TestCase

from ...models.activity import Activity
from ...views import index, list_activities


class ViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_index(self):
        request = self.factory.get('/')

        response = index(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content,
                         b'This could return something helpful!')


class ActivityViewTest(ViewTest):
    def setUp(self):
        super().setUp()
        self.activity = Activity.objects.create(title='Test Activity',
                                                flag=Activity.FLAGS.DRAFT)

    def test_list_activities(self):
        request = self.factory.get('/activities')

        response = list_activities(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content,
                         b'There are 1 Activities in the DB')
