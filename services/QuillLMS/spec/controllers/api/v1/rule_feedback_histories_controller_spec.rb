require 'rails_helper'

describe Api::V1::RuleFeedbackHistoriesController, type: :controller do

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
      get :rule_feedback_history, rule_uid: 1
      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to eq({})
    end
  end
  
end
