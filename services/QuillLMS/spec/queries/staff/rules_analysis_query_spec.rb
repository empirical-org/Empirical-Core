# frozen_string_literal: true

require 'rails_helper'

module Staff
  describe RulesAnalysisQuery do
    include_context 'QuillBigQuery TestRunner Setup'

    context 'big_query_snapshot', :big_query_snapshot do
      #context 'with post query transforms' do
        # let(:users) { create_list(:user, 2) }
        # let(:evidence_activities) { create(:evidence_activity, title: 'Title 1', parent_activity_id: 1, target_level: 1, notes: 'an_activity_1') }
        # let(:evidence_prompts) do
        #   [
        #     create(:evidence_prompt, activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback'),
        #     create(:evidence_prompt, activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
        #   ]
        # end

        # let(:evidence_rules) { [create(:evidence_rule, name: 'so_rule1', rule_type: 'autoML')] }
        # let(:evidence_prompts_rules) { [create(:evidence_prompts_rule, prompt: evidence_prompts.first, rule: evidence_rules.first)] }
        # let(:evidence_feedbacks) do
        #   [
        #     create(:evidence_feedback, rule: evidence_rules.first),
        #     create(:evidence_feedback, rule: evidence_rules.first, order: 2)
        #   ]
        # end

        # let(:feedback_histories) do
        #   first_confidence_level = 0.9599
        #   second_confidence_level = 0.8523
        #   average_confidence_level = (((first_confidence_level + second_confidence_level) / 2) * 100).round

        #   [
        #     create(:feedback_history, prompt: evidence_prompts.first, rule_uid: evidence_rules.first.uid, entry: "f_h1 lorem", metadata: {api: {confidence: first_confidence_level}}),
        #     create(:feedback_history, prompt: evidence_prompts.first, rule_uid: evidence_rules.first.uid, entry: "f_h2 ipsum", metadata: {api: {confidence: second_confidence_level}})
        #   ]
        # end

        # let(:feedback_history_ratings) do
        #   [
        #     FeedbackHistoryRating.create!(feedback_history_id: feedback_histories.first.id, user_id: users.first.id, rating: true),
        #     FeedbackHistoryRating.create!(feedback_history_id: feedback_histories.first.id, user_id: users.second.id, rating: false),
        #     FeedbackHistoryRating.create!(feedback_history_id: feedback_histories.second.id, user_id: users.first.id, rating: true),
        #     FeedbackHistoryRating.create!(feedback_history_id: feedback_histories.second.id, user_id: users.second.id, rating: nil)
        #   ]
        # end

        # let(:feedback_history_flags) do
        #   [
        #     create(:feedback_history_flag, feedback_history_id: feedback_histories.first.id, flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE),
        #     create(:feedback_history_flag, feedback_history_id: feedback_histories.first.id, flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_NON_CONSECUTIVE)
        #   ]
        # end

        # let(:runner_context) do
        #   [
        #     users,
        #     evidence_activities,
        #     evidence_prompts,
        #     evidence_rules,
        #     evidence_prompts_rules,
        #     evidence_feedbacks,
        #     feedback_histories,
        #     feedback_history_ratings,
        #     feedback_history_flags
        #   ]
        # end

        # let(:cte_records) { [runner_context] }

        # xit 'TBD' do

        #   expected = {
        #     api_name: so_rule1.rule_type,
        #     rule_order: so_rule1.suborder,
        #     first_feedback: so_feedback1.text,
        #     second_feedback: so_feedback2.text,
        #     avg_confidence: average_confidence_level,
        #     rule_name: so_rule1.name,
        #     rule_note: so_rule1.note,
        #     rule_uid: so_rule1.uid,
        #     strong_responses: 2,
        #     total_responses: 2,
        #     weak_responses: 1,
        #     repeated_consecutive_responses: 1,
        #     repeated_non_consecutive_responses: 1,
        #   }
        #   binding.pry
        #   exepect(results.first).to eq expected
        # end
      #end

      context 'without post query transforms' do
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

        xit { expect(results.count).to eq 10 }

        xit 'each row contains the expected fields' do
          expected_fields = %i(
            student_name
            student_email
            completed_at
            activity_name
            activity_pack
            score
            timespent
            standard
            tool
            school_name
            classroom_grade
            teacher_name
            classroom_name
          )

          results.each do |row|
            expect(row.keys.to_set > expected_fields.to_set).to be true
          end
        end

      end


    end
  end
end
