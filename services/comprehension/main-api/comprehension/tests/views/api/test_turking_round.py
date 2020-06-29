import json
import pytz

from datetime import datetime

from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIRequestFactory, force_authenticate

from ...factories.activity import ActivityFactory
from ...factories.turking_round import TurkingRoundFactory
from ...factories.user import UserFactory
from ....models.turking_round import TurkingRound
from ....utils import to_iso_8601
from ....views.api import TurkingRoundViewSet


class TestTurkingRoundApiView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.turking_round = TurkingRoundFactory()

    def test_list_turking_rounds_format(self):
        view = TurkingRoundViewSet.as_view({'get': 'list'})

        request = self.factory.get(reverse('turking-list'))

        response = view(request)

        self.assertEqual(json.loads(response.render().content), [{
            'id': self.turking_round.id,
            'activity_id': self.turking_round.activity.id,
            'expires_at': to_iso_8601(self.turking_round.expires_at),
            'expired': self.turking_round.expired,
        }])

    def test_show_turking_round_404(self):
        view = TurkingRoundViewSet.as_view({'get': 'retrieve'})
        request = self.factory.get(reverse('turking-detail',
                                           kwargs={'pk': 999}))

        response = view(request, pk=999)

        self.assertEqual(response.status_code, 404)

    def test_show_turking_round_format(self):
        view = TurkingRoundViewSet.as_view({'get': 'retrieve'})
        request = self.factory.get(
            reverse('turking-detail',
                    kwargs={'pk': self.turking_round.pk}))

        response = view(request, pk=self.turking_round.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.render().content), {
            'id': self.turking_round.id,
            'activity_id': self.turking_round.activity.id,
            'expires_at': to_iso_8601(self.turking_round.expires_at),
            'expired': self.turking_round.expired,
        })


class TestTurkingRoundSecureApiView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.turking_round = TurkingRoundFactory()
        self.view = TurkingRoundViewSet.as_view({'post': 'create',
                                                 'put': 'update'})
        self.user = UserFactory(is_staff=True)
        self.payload = {
            'activity_id': self.turking_round.activity_id,
            'expires_at': pytz.utc.localize(datetime.now()),
        }

    def test_success_when_unauthed_post(self):
        request = self.factory.post(reverse('turking-list'), self.payload,
                                    format='json')

        response = self.view(request)

        self.assertEqual(response.status_code, 201)

    def test_success_when_unauthed_put(self):
        request = self.factory.put(
            reverse('turking-detail',
                    kwargs={'pk': self.turking_round.pk}),
            self.payload,
            format='json')

        response = self.view(request, pk=self.turking_round.pk)

        self.assertEqual(response.status_code, 200)

    def test_success_when_authed_post(self):
        request = self.factory.post(reverse('turking-list'),
                                    self.payload,
                                    format='json')
        force_authenticate(request, user=self.user)

        original_count = TurkingRound.objects.filter(
            expires_at=self.payload['expires_at']).count()

        response = self.view(request)

        self.assertEqual(response.status_code, 201)
        new_count = TurkingRound.objects.filter(
            expires_at=self.payload['expires_at']).count()
        self.assertEqual(original_count + 1, new_count)

    def test_success_when_authed_put(self):
        new_activity = ActivityFactory()
        self.payload['activity_id'] = new_activity.id

        request = self.factory.put(
            reverse('turking-detail',
                    kwargs={'pk': self.turking_round.pk}),
            self.payload,
            format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request, pk=self.turking_round.pk)

        self.turking_round.refresh_from_db()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.turking_round.activity_id, new_activity.id)
