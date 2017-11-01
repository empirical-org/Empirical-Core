require 'rails_helper'

describe TeachersController, type: :controller do

  let(:teacher) { FactoryBot.create(:teacher, :with_a_couple_classroms_with_students) }

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
