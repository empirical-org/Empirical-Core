require 'rails_helper'

describe TeachersController, type: :controller do

  let(:teacher) { create(:teacher, :with_classrooms_students_and_activities) }

  before do
    session[:user_id] = teacher.id
  end

  describe '#classrooms_i_teach_with_students' do

    it 'returns the classrooms with students of the current user' do
      get :classrooms_i_teach_with_students
      expect(response.body).to eq({classrooms: teacher.classrooms_i_teach_with_students}.to_json)
    end
  end



end
