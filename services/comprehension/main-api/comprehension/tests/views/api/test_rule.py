from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIRequestFactory, force_authenticate

from ...factories.rule_set import RuleSetFactory
from ...factories.rule import RuleFactory
from ...factories.activity import ActivityFactory
from ...factories.activity_prompt import ActivityPromptFactory
from ...factories.prompt import PromptFactory
from ...factories.user import UserFactory
from ....models.rule import Rule
from ....views.api import RuleViewSet


class TestRuleApiCreateView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleViewSet.as_view({'post': 'create'})
        self.activity = ActivityFactory()
        self.user = UserFactory(is_staff=True)
        self.rule_set = RuleSetFactory()
        self.prompt = PromptFactory(rule_sets=[self.rule_set])
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        self.payload = {
            "regex_text": "^test",
            "case_sensitive": False
        }

    def test_success_when_unauthed(self):
        request = self.factory.post(reverse('rules-list',
                                            kwargs={
                                             'activities_pk': self.activity.id,
                                             'rulesets_pk': self.rule_set.id
                                            }),
                                    self.payload,
                                    format='json'
                                    )

        response = self.view(request,
                             activities_pk=self.activity.id,
                             rulesets_pk=self.rule_set.id)

        self.assertEqual(response.status_code, 201)

    def test_404_when_rule_set_does_not_exist(self):
        request = self.factory.post(reverse('rules-list',
                                            kwargs={
                                             'activities_pk': self.activity.id,
                                             'rulesets_pk': 404
                                            }),
                                    self.payload,
                                    format='json'
                                    )
        force_authenticate(request, user=self.user)

        response = self.view(request,
                             activities_pk=self.activity.id,
                             rulesets_pk=404)

        self.assertEqual(response.status_code, 404)

    def test_success_when_authed(self):
        request = self.factory.post(reverse('rules-list',
                                            kwargs={
                                             'activities_pk': self.activity.id,
                                             'rulesets_pk': 404
                                            }),
                                    self.payload,
                                    format='json'
                                    )
        force_authenticate(request, user=self.user)

        response = self.view(request,
                             activities_pk=self.activity.id,
                             rulesets_pk=self.rule_set.id)

        self.assertEqual(response.status_code, 201)
        rule = (Rule.objects.filter(regex_text=self.payload['regex_text'])
                    .first())
        self.assertEqual(rule.case_sensitive, self.payload['case_sensitive'])
        self.assertEqual(self.rule_set.rules.first(), rule)


class TestRuleSetApiUpdateView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleViewSet.as_view({'put': 'update'})
        self.activity = ActivityFactory()
        self.user = UserFactory(is_staff=True)
        self.rule_set = RuleSetFactory(priority=1)
        self.prompt = PromptFactory(rule_sets=[self.rule_set])
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        self.rule = RuleFactory(rule_set=self.rule_set)
        self.payload = {
            "regex_text": "^update",
            "case_sensitive": True
        }

    def test_success_when_unauthed(self):
        request = self.factory.put(reverse('rules-detail',
                                           kwargs={
                                             'activities_pk': self.activity.id,
                                             'rulesets_pk': self.rule_set.id,
                                             'pk': self.rule.id
                                           }),
                                   self.payload,
                                   format='json'
                                   )

        response = self.view(request,
                             activities_pk=self.activity.id,
                             rulesets_pk=self.rule_set.id,
                             pk=self.rule.id)

        self.assertEqual(response.status_code, 200)

    def test_404_when_rule_does_not_exist(self):
        request = self.factory.put(reverse('rules-detail',
                                           kwargs={
                                             'activities_pk': self.activity.id,
                                             'rulesets_pk': self.rule_set.id,
                                             'pk': 404
                                           }),
                                   self.payload,
                                   format='json'
                                   )
        force_authenticate(request, user=self.user)

        response = self.view(request,
                             activities_pk=self.activity.id,
                             rulesets_pk=self.rule_set.id,
                             pk=404)

        self.assertEqual(response.status_code, 404)

    def test_404_when_rule_not_on_ruleset(self):
        rule2 = RuleFactory()
        request = self.factory.put(reverse('rules-detail',
                                           kwargs={
                                             'activities_pk': self.activity.id,
                                             'rulesets_pk': self.rule_set.id,
                                             'pk': rule2.id
                                           }),
                                   self.payload,
                                   format='json'
                                   )
        force_authenticate(request, user=self.user)

        response = self.view(request,
                             activities_pk=self.activity.id,
                             rulesets_pk=self.rule_set.id,
                             pk=rule2.id)

        self.assertEqual(response.status_code, 404)

    def test_success_when_authed(self):
        request = self.factory.put(reverse('rules-detail',
                                           kwargs={
                                             'activities_pk': self.activity.id,
                                             'rulesets_pk': self.rule_set.id,
                                             'pk': self.rule.id
                                           }),
                                   self.payload,
                                   format='json'
                                   )
        force_authenticate(request, user=self.user)

        response = self.view(request,
                             activities_pk=self.activity.id,
                             rulesets_pk=self.rule_set.id,
                             pk=self.rule.id)

        self.assertEqual(response.status_code, 200)
        rule = (Rule.objects.filter(regex_text=self.payload['regex_text'])
                    .first())
        self.assertEqual(rule.case_sensitive, self.payload['case_sensitive'])
        self.assertEqual(self.rule_set.rules.first(), rule)


class TestRuleSetApiDeleteView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleViewSet.as_view({'delete': 'destroy'})
        self.activity = ActivityFactory()
        self.user = UserFactory(is_staff=True)
        self.rule_set = RuleSetFactory(priority=1)
        self.prompt = PromptFactory(rule_sets=[self.rule_set])
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        self.rule = RuleFactory(rule_set=self.rule_set)

    def test_success_when_unauthed(self):
        request = self.factory.delete(reverse(
                                        'rules-detail',
                                        kwargs={
                                          'activities_pk': self.activity.id,
                                          'rulesets_pk': self.rule_set.id,
                                          'pk': self.rule.id
                                        }),
                                      )

        response = self.view(request,
                             activities_pk=self.activity.id,
                             rulesets_pk=self.rule_set.id,
                             pk=self.rule.id)

        self.assertEqual(response.status_code, 204)

    def test_404_when_no_ruleset(self):
        request = self.factory.delete(reverse(
                                        'rules-detail',
                                        kwargs={
                                          'activities_pk': self.activity.id,
                                          'rulesets_pk': self.rule_set.id,
                                          'pk': 404
                                        }),
                                      )
        force_authenticate(request, user=self.user)

        response = self.view(request,
                             activities_pk=self.activity.id,
                             rulesets_pk=self.rule_set.id,
                             pk=404)

        self.assertEqual(response.status_code, 404)

    def test_success_on_auth(self):
        request = self.factory.delete(reverse(
                                        'rules-detail',
                                        kwargs={
                                          'activities_pk': self.activity.id,
                                          'rulesets_pk': self.rule_set.id,
                                          'pk': self.rule.id
                                        }),
                                      )
        force_authenticate(request, user=self.user)

        response = self.view(request,
                             activities_pk=self.activity.id,
                             rulesets_pk=self.rule_set.id,
                             pk=self.rule.id)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.rule_set.rules.count(), 0)
        self.assertEqual(Rule.objects.filter(pk=self.rule.id).count(), 0)
