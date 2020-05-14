from django.test import RequestFactory, TestCase

from ...models.activity import Activity
from ...views import index


class ViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_index(self):
        request = self.factory.get('/')

        response = index(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content,
                         b'This could return something helpful!')
