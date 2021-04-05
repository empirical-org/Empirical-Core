require 'rails_helper'

describe Teachers::StudentsController, type: :controller do
  describe 'creating a student' do
    let(:classroom) { create(:classroom) }
    let(:teacher) { classroom.owner }

    before { session[:user_id] = teacher.id }
    
    let(:http_request) do
      post :create, 
        params: {
          classroom_id: classroom.id,
          user: { 
            first_name: 'Joe', 
            last_name: 'Bob'
          }
        }
    end

    it 'kicks off a background job' do
      expect { http_request }.to change(StudentJoinedClassroomWorker.jobs, :size).by(1)
    end
    
    it 'is successful' do
      http_request
      expect(response.status).to eq(200)
    end
  end
end
