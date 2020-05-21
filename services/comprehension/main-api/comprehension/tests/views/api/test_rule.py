import json

from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIRequestFactory, force_authenticate

from ...factories.rule_set import RuleSetFactory
from ...factories.rule import RuleFactory
from ...factories.activity import ActivityFactory
from ...factories.activity_passage import ActivityPassageFactory
from ...factories.activity_prompt import ActivityPromptFactory
from ...factories.passage import PassageFactory
from ...factories.prompt import PromptFactory
from ...factories.user import UserFactory
from ....models.activity import Activity
from ....models.rule_set import RuleSet
from ....models.rule import Rule
from ....models.prompt import Prompt
from ....views.api import (RuleSetViewSet, RuleViewSet)


class TestRuleApiCreateView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleViewSet.as_view({'post': 'create'})
        self.activity = ActivityFactory()
        self.user = UserFactory(is_staff=True)
        self.prompt = PromptFactory()
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        self.rule_set = RuleSetFactory()
        self.prompt.rule_sets.add(self.rule_set)
        self.payload = {
            "regex_text": "^test",
	          "case_sensitive": False
        }

    def test_403_when_unauthed(self):
        request = self.factory.post(f'api/activities/{self.activity.id}/rulesets/{self.rule_set.id}/rules/', self.payload,
                                    format='json')

        response = self.view(request, activities_pk=self.activity.id, rulesets_pk=self.rule_set.id)

        self.assertEqual(response.status_code, 403)

    def test_404_when_rule_set_does_not_exist(self):
        request = self.factory.post(f'api/activities/{self.activity.id}/rulesets/404/rules/', self.payload,
                                    format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id, rulesets_pk=404)

        self.assertEqual(response.status_code, 404)

    def test_success_when_authed(self):
        request = self.factory.post(f'api/activities/{self.activity.id}/rulesets/{self.rule_set.id}/rules/', self.payload,
                                    format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id, rulesets_pk=self.rule_set.id)

        self.assertEqual(response.status_code, 201)
        rule = Rule.objects.filter(regex_text=self.payload['regex_text']).first()
        self.assertEqual(rule.case_sensitive, self.payload['case_sensitive'])
        self.assertEqual(self.rule_set.rules.first(), rule)


class TestRuleSetApiUpdateView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleViewSet.as_view({'put': 'update'})
        self.activity = ActivityFactory()
        self.user = UserFactory(is_staff=True)
        self.prompt = PromptFactory()
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        self.rule_set = RuleSetFactory(priority=1)
        self.prompt.rule_sets.add(self.rule_set)
        self.rule = RuleFactory(rule_set=self.rule_set)
        self.payload = {
	         "regex_text": "^update",
	         "case_sensitive": True
        }

    def test_403_when_unauthed(self):
        request = self.factory.put(f'api/activities/{self.activity.id}/rulesets/{self.rule_set.id}/rules/{self.rule.id}/', self.payload,
                                    format='json')

        response = self.view(request, activities_pk=self.activity.id, rulesets_pk=self.rule_set.id, pk=self.rule.id)

        self.assertEqual(response.status_code, 403)

    def test_404_when_rule_does_not_exist(self):
        request = self.factory.put(f'api/activities/{self.activity.id}/rulesets/404/rules/404/', self.payload,
                                    format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id, rulesets_pk=self.rule_set.id, pk=404)

        self.assertEqual(response.status_code, 404)

    def test_404_when_rule_not_on_ruleset(self):
        rule2 = RuleFactory()
        request = self.factory.put(f'api/activities/{self.activity.id}/rulesets/404/rules/{rule2.id}/', self.payload,
                                    format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id, rulesets_pk=self.rule_set.id, pk=rule2.id)

        self.assertEqual(response.status_code, 404)

    def test_success_when_authed(self):
        request = self.factory.put(f'api/activities/{self.activity.id}/rulesets/{self.rule_set.id}/rules/{self.rule.id}/', self.payload,
                                    format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id, rulesets_pk=self.rule_set.id, pk=self.rule.id)

        self.assertEqual(response.status_code, 200)
        rule = Rule.objects.filter(regex_text=self.payload['regex_text']).first()
        self.assertEqual(rule.case_sensitive, self.payload['case_sensitive'])
        self.assertEqual(self.rule_set.rules.first(), rule)



class TestRuleSetApiDeleteView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleViewSet.as_view({'delete': 'destroy'})
        self.activity = ActivityFactory()
        self.user = UserFactory(is_staff=True)
        self.prompt = PromptFactory()
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        self.rule_set = RuleSetFactory(priority=1)
        self.prompt.rule_sets.add(self.rule_set)
        self.rule = RuleFactory(rule_set=self.rule_set)

    def test_403_when_unauthed(self):
        request = self.factory.delete(f'api/activities/{self.activity.id}/rulesets/{self.rule_set.id}/rules/{self.rule.id}/')

        response = self.view(request, activities_pk=self.activity.id, rulesets_pk=self.rule_set.id, pk=self.rule.id)

        self.assertEqual(response.status_code, 403)

    def test_404_when_no_ruleset(self):
        request = self.factory.delete(f'api/activities/{self.activity.id}/rulesets/{self.rule_set.id}/rules/404/')
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id, rulesets_pk=self.rule_set.id, pk=404)

        self.assertEqual(response.status_code, 404)

    def test_success_on_auth(self):
        request = self.factory.delete(f'api/activities/{self.activity.id}/rulesets/{self.rule_set.id}/rules/{self.rule.id}')
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id, rulesets_pk=self.rule_set.id, pk=self.rule.id)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.rule_set.rules.count(), 0)
        self.assertEqual(Rule.objects.filter(pk=self.rule.id).count(), 0)
