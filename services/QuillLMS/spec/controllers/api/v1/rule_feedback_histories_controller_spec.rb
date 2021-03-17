require 'rails_helper'

describe Api::V1::RuleFeedbackHistoriesController, type: :controller do

  describe '#by_conjunction' do 
    it 'should return sucessfully' do 
        get :by_conjunction, conjunction: 'so'

        expect(response.status).to eq 200
        expect(JSON.parse(response.body)).to eq(
            {"rule_feedback_histories"=>[]}
        )
    end

  end
  
end
