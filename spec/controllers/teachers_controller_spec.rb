require 'rails_helper'

describe TeachersController, type: :controller do

  let(:teacher) { create(:teacher, :with_classrooms_students_and_activities) }
  let!(:co_taught_classroom) {create(:classroom, :with_no_teacher)}
  let!(:co_taught_classrooms_teacher) {create(:classrooms_teacher, classroom: co_taught_classroom, user: teacher, role: 'coteacher')}

  before do
    session[:user_id] = teacher.id
  end

  describe '#classrooms_i_teach_with_students' do

    it 'returns the classrooms with students of the current user' do
      get :classrooms_i_teach_with_students
      expect(response.body).to eq({classrooms: teacher.classrooms_i_teach_with_students}.to_json)
    end

    it 'returns the classrooms the current user owns' do
      get :classrooms_i_teach_with_students
      expect(response.body).to eq({classrooms: teacher.classrooms_i_teach_with_students}.to_json)
    end
  end

  describe '#classrooms_i_own_with_students' do

    it 'returns the classrooms with students the current user owns' do
      get :classrooms_i_own_with_students
      expect(response.body).to eq({classrooms: teacher.classrooms_i_own_with_students}.to_json)
    end

    it 'does not return the classrooms with students the current user coteaches' do
      get :classrooms_i_own_with_students
      expect(response.body).not_to eq({classrooms: teacher.classrooms_i_teach_with_students}.to_json)
    end
  end



end
