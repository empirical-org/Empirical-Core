require 'spec_helper'

describe Teachers::UnitsController, type: :controller do 
  describe 'creating a unit' do
    let(:teacher) { FactoryGirl.create(:teacher) }
    let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }

    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    it 'kicks off a background job' do
      expect {
        post :create, classroom_id: classroom.id, 
                      unit_name: 'A Cool Learning Experience', 
                      selected_classrooms: "[]", 
                      pairs_of_activity_id_and_due_date: "[]"
        expect(response.status).to eq(302) # Redirects after success
      }.to change(AssignActivityWorker.jobs, :size).by(1)
    end
  end
end