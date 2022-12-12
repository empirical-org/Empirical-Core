# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::RuleFeedbackHistoriesController, type: :controller do
  before do
    # This is for CircleCI. Note that this refresh is NOT concurrent.
    ActiveRecord::Base.refresh_materialized_view('feedback_histories_grouped_by_rule_uid', concurrently: false)
  end

  describe '#by_conjunction' do
    it 'should return successfully' do
      get :by_conjunction, params: { conjunction: 'so', activity_id: 1 }, as: :json

      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to eq(
        {"rule_feedback_histories"=>[]}
      )
    end

    it 'should pass conjunction, activity_id, start_date and end_date through to #generate_report' do
      CONJUNCTION = 'because'
      ACTIVITY_ID = '17'
      START_DATE = '2021-04-05T22:32:14.524Z'
      END_DATE = '2021-05-05T22:32:14.524Z'

      expect(RuleFeedbackHistory).to receive(:generate_report).with({
        conjunction: CONJUNCTION,
        activity_id: ACTIVITY_ID,
        start_date: START_DATE,
        end_date: END_DATE
      })

      get :by_conjunction,
        params: {
          conjunction: CONJUNCTION,
          activity_id: ACTIVITY_ID,
          start_date: START_DATE,
          end_date: END_DATE
        }
    end
  end

  describe '#rule_detail' do
    it 'should return successfully' do
      get :rule_detail, params: { rule_uid: 1, prompt_id: 1 }, as: :json
      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to eq({"1"=>{"responses"=>[]}})
    end
  end

  describe '#prompt_health' do
    context 'no associated feedback sessions' do
      it 'should return successfully' do
        get :prompt_health, params: { activity_id: 1 }, as: :json
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)).to eq({})
      end
    end

    context 'associated feedback sessions' do
      it 'should return successfully' do
        main_activity = create(:activity)

        prompt = Evidence::Prompt.create!(
          text: 'foobarbazbat',
          conjunction: 'so',
          activity: main_activity,
          max_attempts: 3
         )

        as1 = create(:activity_session, activity_id: main_activity.id)

        f_h1 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 1, optimal: false, prompt_id: prompt.id)

        get :prompt_health, params: { activity_id: main_activity.id }, as: :json
        expect(response.status).to eq 200
        expect(JSON.parse(response.body).keys.length).to eq 1
      end
    end
  end

  describe '#activity_health' do
    context 'no associated feedback sessions' do
      it 'should return successfully' do
        get :activity_health, params: { activity_id: 1 }, as: :json
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)['average_time_spent']).to eq(nil)
        expect(JSON.parse(response.body)['average_completion_rate']).to eq(nil)
      end
    end

    context 'associated feedback sessions' do
      it 'should return successfully' do
        main_activity = create(:activity)

        prompt = Evidence::Prompt.create!(
          text: 'foobarbazbat',
          conjunction: 'so',
          activity: main_activity,
          max_attempts: 3
         )

        as1 = create(:activity_session, state: 'finished', activity_id: main_activity.id, timespent: 61)

        f_h1 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 1, optimal: false, prompt_id: prompt.id)

        get :activity_health, params: { activity_id: main_activity.id }, as: :json
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)['average_time_spent']).to eq("01:01")
        expect(JSON.parse(response.body)['average_completion_rate']).to eq(100)
      end
    end
  end

end
