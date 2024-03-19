# frozen_string_literal: true

require 'rails_helper'

module Staff
  describe RulesAnalysisQuery do
    include_context 'QuillBigQuery TestRunner Setup'

    describe '#format' do
      let(:rule) { create(:evidence_rule, name: 'so_rule1', rule_type: 'autoML') }

      it 'should format correctly' do
        create(:evidence_feedback, rule: rule, order: 1, text: 'a'*10)
        create(:evidence_feedback, rule: rule, order: 2, text: 'b'*10)

        example_bigquery_result = [
          {
            :id => rule.id,
            :rules_uid => "0effa491-f9c7-482c-bce4-3982c5644259",
            :activity_id => 80,
            :rule_type => "autoML",
            :rule_suborder => 1,
            :rule_name => "so_rule2",
            :rule_note => "This rule is a test",
            :total_responses => 1,
            :avg_confidence => nil,
            :total_strong => 1,
            :total_weak => 0,
            :repeated_consecutive => 1,
            :repeated_non_consecutive => 0
          }
       ]

        expected = [{
          rule_uid: "0effa491-f9c7-482c-bce4-3982c5644259",
          api_name: rule.rule_type,
          rule_order: 1,
          first_feedback: 'a'*10,
          second_feedback: 'b'*10,
          rule_note: "This rule is a test",
          rule_name: "so_rule2",
          avg_confidence: nil,
          total_responses: 1,
          strong_responses: 1,
          weak_responses: 0,
          repeated_consecutive_responses: 1,
          repeated_non_consecutive_responses: 0
        }]

        expect(
          described_class.new(activity_id: 1, conjunction: 'so').post_query_transform(example_bigquery_result)
        ).to eq expected
      end
    end

    context 'big_query_snapshot', :big_query_snapshot do
      context 'without post query transforms' do
        before do
          described_class.class_eval { def post_query_transform(x) = x }
        end

        let(:users) { [create(:user)] }
        let(:evidence_activities) { [create(:evidence_activity, title: 'Title 1', parent_activity_id: 1, target_level: 1, notes: 'an_activity_1') ] }

        let(:so_prompt1) { create(:evidence_prompt, activity: evidence_activities.first, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback') }
        let(:because_prompt1) { create(:evidence_prompt, activity: evidence_activities.first, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback') }
        let(:evidence_prompts) { [so_prompt1, because_prompt1] }

        let(:so_rule1) { create(:evidence_rule, name: 'so_rule1', rule_type: 'autoML') }
        let(:so_rule2) { create(:evidence_rule, name: 'so_rule2', rule_type: 'autoML') }
        let(:so_rule3) { create(:evidence_rule, name: 'so_rule3', rule_type: 'autoML') }
        let(:so_rule4) { create(:evidence_rule, name: 'so_rule4', rule_type: 'autoML') }
        let(:evidence_rules) { [so_rule1, so_rule2, so_rule3, so_rule4] }

        let(:evidence_prompts_rules) do
          [
            create(:evidence_prompts_rule, prompt: so_prompt1, rule: so_rule1),
            create(:evidence_prompts_rule, prompt: so_prompt1, rule: so_rule2),
            create(:evidence_prompts_rule, prompt: so_prompt1, rule: so_rule3),
            create(:evidence_prompts_rule, prompt: so_prompt1, rule: so_rule4)
          ]
        end

        context 'without activity versions' do
          let(:feedback_histories) do
            [
              create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule2.uid, time: "2021-04-07T19:02:54", feedback_session_uid: "def"),
              create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule3.uid, time: "2021-05-07T19:02:54", feedback_session_uid: "ghi"),
              create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule4.uid, time: "2021-06-07T19:02:54", feedback_session_uid: "abc")
            ]
          end

          let(:feedback_history_flags) { [ create(:feedback_history_flag, feedback_history: feedback_histories.first) ] }
          let(:feedback_history_ratings) { [ create(:feedback_history_rating, feedback_history: feedback_histories.first, user: users.first) ] }

          let(:runner_context) {
            [
              evidence_activities,
              evidence_prompts,
              evidence_rules,
              evidence_prompts_rules,
              feedback_histories,
              feedback_history_flags,
              feedback_history_ratings,
              users
            ]
          }

          let(:cte_records) { [runner_context] }

          let(:query_args) do
            {
              conjunction: 'so',
              activity_id: evidence_activities.first.id,
              start_date: "2021-03-06T19:02:54",
              end_date: "2021-04-10T19:02:54"
            }
          end

          it 'should aggregate feedbacks for a given rule'  do
            expect(results.count).to eq 1
            expect(results.first[:rule_type]).to eq 'autoML'
          end
        end

        context 'with activity versions' do
          let(:feedback_histories) do
            [
              create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule2.uid, time: "2021-04-07T19:02:54", feedback_session_uid: "def", activity_version: 2),
              create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule3.uid, time: "2021-05-07T19:02:54", feedback_session_uid: "ghi", activity_version: 2),
              create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule4.uid, time: "2021-06-07T19:02:54", feedback_session_uid: "abc", activity_version: 1)
            ]
          end

          let(:feedback_history_flags) { [ create(:feedback_history_flag, feedback_history: feedback_histories.first) ] }
          let(:feedback_history_ratings) { [ create(:feedback_history_rating, feedback_history: feedback_histories.first, user: users.first) ] }

          let(:runner_context) {
            [
              evidence_activities,
              evidence_prompts,
              evidence_rules,
              evidence_prompts_rules,
              feedback_histories,
              feedback_history_flags,
              feedback_history_ratings,
              users
            ]
          }

          let(:cte_records) { [runner_context] }

          let(:query_args) do
            {
              conjunction: 'so',
              activity_id: evidence_activities.first.id,
              start_date: "2021-03-06T19:02:54",
              end_date: "2021-07-10T19:02:54",
              activity_version: 2
            }
          end

          it 'should filter by activity_version if specified'  do
            puts results
            expect(results.count).to eq 2
            expect(results.select {|rf| rf[:rules_uid] == so_rule4.uid}.empty?).to be
            expect(results.first[:rule_type]).to eq 'autoML'
          end
        end

      end

    end
  end
end
