require 'rails_helper'

describe Api::V1::RuleFeedbackHistoriesController, type: :controller do
  before do
    # This is for CircleCI. Note that this refresh is NOT concurrent.
    ActiveRecord::Base.refresh_materialized_view('feedback_histories_grouped_by_rule_uid', false)
  end

  describe '#by_conjunction' do
    it 'should return successfully' do
      get :by_conjunction, params: { conjunction: 'so', activity_id: 1 }

      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to eq(
        {"rule_feedback_histories"=>[]}
      )
    end

    it 'should pass conjunction, activity_id, start_date, end_date and turk_session_id through to #generate_report' do
      CONJUNCTION = 'because'
      ACTIVITY_ID = '17'
      START_DATE = '2021-04-05T22:32:14.524Z'
      END_DATE = '2021-05-05T22:32:14.524Z'
      TURK_SESSION_ID = '123-abc'

      expect(RuleFeedbackHistory).to receive(:generate_report).with({
        conjunction: CONJUNCTION,
        activity_id: ACTIVITY_ID,
        start_date: START_DATE,
        end_date: END_DATE,
        turk_session_id: TURK_SESSION_ID,
      })

      get :by_conjunction,
        params: {
          conjunction: CONJUNCTION,
          activity_id: ACTIVITY_ID,
          start_date: START_DATE,
          end_date: END_DATE,
          turk_session_id: TURK_SESSION_ID
        }
    end
  end

  describe '#rule_detail' do
    it 'should return successfully' do
      get :rule_detail, params: { rule_uid: 1, prompt_id: 1 }
      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to eq({"1"=>{"responses"=>[]}})
    end
  end

  describe '#prompt_health' do
    context 'no associated feedback sessions' do
      it 'should return successfully' do
        get :prompt_health, params: { activity_id: 1 }
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)).to eq({})
      end
    end

    context 'associated feedback sessions' do
      it 'should return successfully' do
        main_activity = create(:activity)

        prompt = Comprehension::Prompt.create!(
          text: 'foobarbazbat',
          conjunction: 'so',
          activity: main_activity,
          max_attempts: 3
         )

        as1 = create(:activity_session, activity_id: main_activity.id)

        f_h1 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 1, optimal: false, prompt_id: prompt.id)

        get :prompt_health, params: { activity_id: main_activity.id }
        expect(response.status).to eq 200
        expect(JSON.parse(response.body).keys.length).to eq 1
      end
    end
  end

end
