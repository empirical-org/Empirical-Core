require 'rails_helper'

describe Api::V1::RuleFeedbackHistoriesController, type: :controller do
  before do 
    # This is for CircleCI. Note that this refresh is NOT concurrent.
    ActiveRecord::Base.refresh_materialized_view('feedback_histories_grouped_by_rule_uid', false)
  end

  describe '#by_conjunction' do 
    it 'should return sucessfully' do 
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
  
end
