require 'spec_helper'
require 'rails_helper'

describe Teachers::UnitsController, type: :controller do
  let!(:teacher) { FactoryGirl.create(:teacher) }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }

  before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
  end

  describe '#create' do
    it 'kicks off a background job' do
      expect {
        post :create, classroom_id: classroom.id,
                      unit: {
                        name: 'A Cool Learning Experience',
                        classrooms: [],
                        activities: []
                      }
        expect(response.status).to eq(200)
      }.to change(AssignActivityWorker.jobs, :size).by(1)
    end
  end

  describe '#index' do
    let!(:activity) {FactoryGirl.create(:activity)}
    let!(:unit) {FactoryGirl.create(:unit)}
    let!(:classroom_activity) {FactoryGirl.create(:classroom_activity, due_date: Time.now, unit: unit, classroom: classroom, activity: activity)}

    it 'includes classrooms' do
      post :index
      x = JSON.parse(response.body)
      expect(x['units'][0]['classrooms']).to_not be_empty
    end
  end

  describe '#update' do
    let!(:unit) {FactoryGirl.create(:unit)}
    let!(:unit2) {FactoryGirl.create(:unit)}

    it 'sends a 200 status code when a unique name is sent over' do
      put :update, id: unit.id,
                    unit: {
                      name: 'Super Unique Unit Name'
                    }
      expect(response.status).to eq(200)
    end

    it 'sends a 422 error code when a non-unique name is sent over' do
      put :update, id: unit.id,
                    unit: {
                      name: unit2.name
                    }
      expect(response.status).to eq(422)

    end
  end




  # describe 'units concern' do
  #   let(:teacher) { FactoryGirl.create(:teacher) }
  #   let(:unit1) {FactoryGirl.create(:unit, user_id: teacher.id )}
  #   let(:unit2) {FactoryGirl.create(:unit, user_id: teacher.id )}
  #   let(:other_teacher_unit) {FactoryGirl.create(:unit, name: unit1.name)}
  #
  #
  #   describe '#units_with_same_name_by_current_user' do
  #     it "returns logged in users' units with the same name as the provided argument" do
  #       expect(units_with_same_name_by_current_user(unit1.name)).to eq([unit1])
  #     end
  #
  #     it "returns logged in users' units with the same name as the provided argument" do
  #       expect(true).to eq([unit1])
  #     end
  #   end
  # end

end
