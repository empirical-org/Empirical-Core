import json

from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIRequestFactory, force_authenticate

from ...factories.rule_set import RuleSetFactory
from ...factories.rule import RuleFactory
from ...factories.activity import ActivityFactory
from ...factories.activity_prompt import ActivityPromptFactory
from ...factories.prompt import PromptFactory
from ...factories.user import UserFactory
from ....models.rule_set import RuleSet
from ....models.prompt import Prompt
from ....views.api import RuleSetViewSet


class TestRuleSetApiListView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleSetViewSet.as_view({'get': 'list'})
        self.activity = ActivityFactory()
        self.prompt = PromptFactory()
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)

    def test_show_activity_404(self):
        request = self.factory.get(reverse('rulesets-list',
                                           kwargs={'activities_pk': 400}))
        response = self.view(request, activities_pk=400)

        self.assertEqual(response.status_code, 404)

    def test_list_rule_sets_format(self):
        rule_set1 = RuleSetFactory(priority=1)
        rule_set2 = RuleSetFactory(priority=2)
        rule = RuleFactory(regex_text='^test', rule_set=rule_set1)
        self.prompt.rule_sets.add(rule_set1, rule_set2)

        request = self.factory.get(reverse('rulesets-list',
                                           kwargs={'activities_pk':
                                                   self.activity.id}))
        response = self.view(request, activities_pk=self.activity.id)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.render().content), [
            {'id': rule_set1.id,
             'name': rule_set1.name,
             'rules': [
               {'id': rule.id,
                'regex_text': rule.regex_text,
                'case_sensitive': rule.case_sensitive}
             ],
             'prompts': [
               {'id': self.prompt.id,
                'conjunction': self.prompt.conjunction}]
             },
            {'id': rule_set2.id,
             'name': rule_set2.name,
             'rules': [],
             'prompts': [
               {'id': self.prompt.id,
                'conjunction': self.prompt.conjunction}]
             },
        ])


class TestRuleSetApiRetrieveView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleSetViewSet.as_view({'get': 'retrieve'})
        self.activity = ActivityFactory()
        self.rule_set = RuleSetFactory(priority=1)
        self.prompt = PromptFactory(rule_sets=[self.rule_set])
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        self.rule = RuleFactory(regex_text='^test', rule_set=self.rule_set)

    def test_show_activity_404(self):
        request = self.factory.get(reverse('rulesets-detail',
                                           kwargs={'activities_pk': 400,
                                                   'pk': self.rule_set.id}))
        response = self.view(request, activities_pk=400)

        self.assertEqual(response.status_code, 404)

    def test_show_rule_set_404(self):
        request = self.factory.get(reverse('rulesets-detail',
                                           kwargs={
                                            'activities_pk': self.activity.id,
                                            'pk': 400
                                           }))
        response = self.view(request, activities_pk=self.activity.id, pk=400)

        self.assertEqual(response.status_code, 404)

    def test_show_rule_set_format(self):
        request = self.factory.get(reverse('rulesets-detail',
                                           kwargs={
                                            'activities_pk': self.activity.id,
                                            'pk': self.rule_set.id
                                           }))
        response = self.view(request,
                             activities_pk=self.activity.id,
                             pk=self.rule_set.id)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.render().content),
                         {
                            'id': self.rule_set.id,
                            'name': self.rule_set.name,
                            'feedback': self.rule_set.feedback,
                            'rules': [
                                {
                                    'id': self.rule.id,
                                    'regex_text': self.rule.regex_text,
                                    'case_sensitive': self.rule.case_sensitive
                                }
                            ],
                            'prompts': [
                                {
                                    'id': self.prompt.id,
                                    'conjunction': self.prompt.conjunction
                                }
                            ]
                        }
        )


class TestRuleSetApiCreateView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleSetViewSet.as_view({'post': 'create'})
        self.activity = ActivityFactory()
        self.user = UserFactory(is_staff=True)
        self.prompt = PromptFactory()
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        self.payload = {
            "name": "remove all instances of 'it contains methane'",
            "feedback": "Revise your work.",
            "prompt_ids": [self.prompt.id]
        }

    def test_403_when_unauthed(self):
        request = self.factory.post(reverse('rulesets-list',
                                            kwargs={'activities_pk':
                                                    self.activity.id}),
                                    self.payload,
                                    format='json')

        response = self.view(request, activities_pk=self.activity.id)

        self.assertEqual(response.status_code, 403)

    def test_success_when_authed(self):
        request = self.factory.post(reverse('rulesets-list',
                                            kwargs={'activities_pk':
                                                    self.activity.id}),
                                    self.payload,
                                    format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id)

        self.assertEqual(response.status_code, 201)
        rule_set = RuleSet.objects.filter(name=self.payload['name']).first()
        self.assertEqual(rule_set.feedback, self.payload['feedback'])
        prompt_ids = self.payload['prompt_ids']
        prompts = Prompt.objects.filter(id__in=prompt_ids)
        self.assertEqual(list(prompts.all()), list(rule_set.prompts.all()))

    def test_prompt_does_not_exist(self):
        payload = self.payload
        payload['prompt_ids'] = [100]
        request = self.factory.post(reverse('rulesets-list',
                                            kwargs={'activities_pk':
                                                    self.activity.id}),
                                    self.payload,
                                    format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id)

        self.assertEqual(response.status_code, 404)

    def test_prompt_does_not_belong_to_activity(self):
        bad_prompt = PromptFactory(text='bad prompt')
        payload = self.payload
        payload['prompt_ids'] = [bad_prompt.id]

        request = self.factory.post(reverse('rulesets-list',
                                            kwargs={'activities_pk':
                                                    self.activity.id}),
                                    self.payload,
                                    format='json')

        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id)

        self.assertEqual(response.status_code, 400)


class TestRuleSetApiDeleteView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleSetViewSet.as_view({'delete': 'destroy'})
        self.activity = ActivityFactory()
        self.user = UserFactory(is_staff=True)
        self.rule_set = RuleSetFactory(priority=1)
        self.prompt = PromptFactory(rule_sets=[self.rule_set])
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)

    def test_403_when_unauthed(self):
        request = self.factory.delete(reverse(
                                        'rulesets-detail',
                                        kwargs={
                                            'activities_pk': self.activity.id,
                                            'pk': self.rule_set.id
                                        }
                                      ))

        response = self.view(request,
                             activities_pk=self.activity.id,
                             pk=self.rule_set.id)

        self.assertEqual(response.status_code, 403)

    def test_404_when_no_ruleset(self):
        request = self.factory.delete(reverse(
                                        'rulesets-detail',
                                        kwargs={
                                            'activities_pk': self.activity.id,
                                            'pk': 400
                                        }
                                      ))
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id, pk=404)

        self.assertEqual(response.status_code, 404)

    def test_success_on_auth(self):
        request = self.factory.delete(reverse(
                                        'rulesets-detail',
                                        kwargs={
                                            'activities_pk': self.activity.id,
                                            'pk': self.rule_set.id
                                        }
                                      ))
        force_authenticate(request, user=self.user)

        response = self.view(request,
                             activities_pk=self.activity.id,
                             pk=self.rule_set.id)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.prompt.rule_sets.count(), 0)
        self.assertEqual(Prompt.objects.filter(pk=self.rule_set.id).count(), 0)


class TestRuleSetApiUpdateView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleSetViewSet.as_view({'put': 'update'})
        self.activity = ActivityFactory()
        self.user = UserFactory(is_staff=True)
        self.rule_set = RuleSetFactory(priority=1)
        self.prompt = PromptFactory(rule_sets=[self.rule_set])
        self.prompt2 = PromptFactory()
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt2,
                              order=1)
        self.payload = {
            "name": "updated name",
            "feedback": "updated feedback",
            "prompt_ids": [self.prompt2.id]
        }

    def test_403_when_unauthed(self):
        request = self.factory.put(reverse(
                                        'rulesets-detail',
                                        kwargs={
                                            'activities_pk': self.activity.id,
                                            'pk': self.rule_set.id
                                        }
                                    ),
                                   self.payload,
                                   format='json')

        response = self.view(request,
                             activities_pk=self.activity.id,
                             pk=self.rule_set.id)

        self.assertEqual(response.status_code, 403)

    def test_success_when_authed(self):
        request = self.factory.put(reverse(
                                        'rulesets-detail',
                                        kwargs={
                                            'activities_pk': self.activity.id,
                                            'pk': self.rule_set.id
                                        }
                                    ),
                                   self.payload,
                                   format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request,
                             activities_pk=self.activity.id,
                             pk=self.rule_set.id)

        self.assertEqual(response.status_code, 200)
        rule_set = RuleSet.objects.filter(name=self.payload['name']).first()
        self.assertEqual(rule_set.feedback, self.payload['feedback'])
        prompt_ids = self.payload['prompt_ids']
        prompts = Prompt.objects.filter(id__in=prompt_ids)
        self.assertEqual(list(prompts.all()),
                         list(self.rule_set.prompts.all()))

    def test_delete_all_prompts_error(self):
        payload = self.payload
        payload['prompt_ids'] = []
        request = self.factory.put(reverse(
                                        'rulesets-detail',
                                        kwargs={
                                            'activities_pk': self.activity.id,
                                            'pk': self.rule_set.id
                                        }
                                    ),
                                   self.payload,
                                   format='json')
        force_authenticate(request, user=self.user)

        response = self.view(request,
                             activities_pk=self.activity.id,
                             pk=self.rule_set.id)

        self.assertEqual(response.status_code, 400)


class TestRuleSetApiOrderView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RuleSetViewSet.as_view({'put': 'order'})
        self.activity = ActivityFactory()
        self.user = UserFactory(is_staff=True)
        self.rule_set1 = RuleSetFactory(priority=1)
        self.rule_set2 = RuleSetFactory(priority=2)
        self.rule_set3 = RuleSetFactory(priority=3)
        self.prompt = PromptFactory(rule_sets=[
                                  self.rule_set1,
                                  self.rule_set2,
                                  self.rule_set3])
        ActivityPromptFactory(activity=self.activity,
                              prompt=self.prompt,
                              order=1)
        self.payload = {
            "rulesetIDs": [
                int(self.rule_set3.id),
                int(self.rule_set2.id),
                int(self.rule_set1.id)
            ]
        }

    def test_403_when_unauthed(self):
        request = self.factory.put(reverse('rulesets-order',
                                           kwargs={
                                             'activities_pk': self.activity.id
                                           }),
                                   self.payload,
                                   format='json'
                                   )
        response = self.view(request, activities_pk=self.activity.id)

        self.assertEqual(response.status_code, 403)

    def test_400_when_list_does_not_match(self):
        payload = {"rulesetIDs": [int(self.rule_set1.id)]}
        request = self.factory.put(reverse('rulesets-order',
                                           kwargs={
                                             'activities_pk': self.activity.id
                                           }),
                                   payload,
                                   format='json'
                                   )
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id)

        self.assertEqual(response.status_code, 400)

    def test_400_when_list_rulesets_dont_belong_to_activity(self):
        wrong_rule_set = RuleSetFactory()
        payload = {"rulesetIDs": [
                                    int(self.rule_set1.id),
                                    int(self.rule_set2.id),
                                    int(wrong_rule_set.id)
                   ]}
        request = self.factory.put(reverse('rulesets-order',
                                           kwargs={
                                             'activities_pk': self.activity.id
                                           }),
                                   payload,
                                   format='json'
                                   )
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id)

        self.assertEqual(response.status_code, 400)

    def test_400_when_list_contains_non_rulesets(self):
        payload = {"rulesetIDs": [int(self.rule_set1.id), 400]}
        request = self.factory.put(reverse('rulesets-order',
                                           kwargs={
                                             'activities_pk': self.activity.id
                                           }),
                                   payload,
                                   format='json'
                                   )
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id)

        self.assertEqual(response.status_code, 400)

    def test_update_order(self):
        request = self.factory.put(reverse('rulesets-order',
                                           kwargs={
                                             'activities_pk': self.activity.id
                                           }),
                                   self.payload,
                                   format='json'
                                   )
        force_authenticate(request, user=self.user)

        response = self.view(request, activities_pk=self.activity.id)

        self.assertEqual(response.status_code, 200)
        rule_sets = self.prompt.rule_sets.all().order_by('priority')
        self.assertEqual(rule_sets[0], self.rule_set3)
        self.assertEqual(rule_sets[1], self.rule_set2)
        self.assertEqual(rule_sets[2], self.rule_set1)
