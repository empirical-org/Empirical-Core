require 'spec_helper'

describe Teachers::StudentsController, type: :controller do 
  describe 'creating a student' do
    let(:teacher) { FactoryGirl.create(:teacher) }
    let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }

    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    it 'kicks off a background job' do
      expect {
        post :create, classroom_id: classroom.id, user: {first_name: 'Joe', last_name: 'Bob'}
        expect(response.status).to eq(302) # Redirects after success
      }.to change(StudentCreationWorker.jobs, :size).by(1)
    end
  end
end