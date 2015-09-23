require 'rails_helper'

describe Cms::UnitTemplatesController, type: :controller do
  let!(:unit_template1) { FactoryGirl.create(:unit_template) }
  let!(:unit_template2) { FactoryGirl.create(:unit_template) }


  let(:parsed_body) { JSON.parse(response.body) }

  describe '#index, format: :json' do
    it 'responds with list of unit_templates' do
      get :index, format: :json
      expect(parsed_body['unit_templates'].length).to eq(2)
    end
  end
end