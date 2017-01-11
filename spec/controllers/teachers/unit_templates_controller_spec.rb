require 'rails_helper'

describe  Teachers::UnitTemplatesController, type: :controller do
  let!(:unit_template1) { FactoryGirl.create(:unit_template) }
  let!(:unit_template2) { FactoryGirl.create(:unit_template) }
  let!(:teacher) { FactoryGirl.create(:user, role: 'teacher')}

  let(:parsed_body) { JSON.parse(response.body) }

  def login_user user
    session[:user_id] = user.id
  end

  describe '#index, format: :json' do
    it 'responds with list of unit_templates' do
      login_user(teacher)
      get :index, format: :json
      expect(parsed_body['unit_templates'].length).to eq(2)
    end
  end

  describe '#fast_assign' do
    context 'creates a new unit' do
      it "that is assigned to all students" do

      end
    end

    context 'updates an existing unit' do
      it "does not overwrite the existing unit" do

      end
      
      it "that adds new activities to the existing unit" do

      end

      it "that assigns the new activities to all students" do

      end
    end
  end
end
