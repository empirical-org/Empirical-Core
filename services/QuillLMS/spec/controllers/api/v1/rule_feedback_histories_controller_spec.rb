require 'rails_helper'

describe Api::V1::RuleFeedbackHistoriesController, type: :controller do
  before do 
    # This is for CircleCI. Note that this refresh is NOT concurrent.
    ActiveRecord::Base.refresh_materialized_view('feedback_histories_grouped_by_rule_uid', false)
  end

  describe '#by_conjunction' do 
    it 'should return successfully' do 
        get :by_conjunction, conjunction: 'so', activity_id: 1

        expect(response.status).to eq 200
        expect(JSON.parse(response.body)).to eq(
            {"rule_feedback_histories"=>[]}
        )
    end
  end

  describe '#rule_detail' do 
    it 'should return successfully' do 
      get :rule_detail, rule_uid: 1, prompt_id: 1
      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to eq({"1"=>{"responses"=>[]}})
    end
  end

  describe '#prompt_health' do 
    context 'no associated feedback sessions' do 
      it 'should return successfully' do 
        get :prompt_health, activity_id: 1
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

        get :prompt_health, activity_id: main_activity.id
        expect(response.status).to eq 200
        expect(JSON.parse(response.body).keys.length).to eq 1
      end
    end     
  end
  
end
