require 'rails_helper'

describe Cms::UnitTemplatesController, type: :controller do
  let!(:author) {FactoryGirl.create(:author)}
  let!(:unit_template1) { FactoryGirl.create(:unit_template, author_id: author.id) }
  let!(:unit_template2) { FactoryGirl.create(:unit_template, author_id: author.id) }
  let!(:staff) { FactoryGirl.create(:user, role: 'staff')}

  let(:parsed_body) { JSON.parse(response.body) }

  def login_user user
    session[:user_id] = user.id
  end

  describe '#index, format: :json' do
    it 'responds with list of unit_templates' do
      login_user(staff)
      get :index, format: :json
      expect(parsed_body['unit_templates'].length).to eq(2)
    end
  end
end
