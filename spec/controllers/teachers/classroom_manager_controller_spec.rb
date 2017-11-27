require 'rails_helper'

describe Teachers::ClassroomManagerController, type: :controller do

  context '#archived_classroom_manager_data' do
    it 'returns all archived and nonarchived classrooms' do
      teacher = create(:teacher_with_a_couple_active_and_archived_classrooms)
      all_classrooms = ClassroomsTeacher.where(user_id: teacher.id).map { |ct| Classroom.unscoped.find ct.classroom_id }
      visible_classrooms = all_classrooms.select(&:visible)
      archived_classrooms = all_classrooms - visible_classrooms
      session[:user_id] = teacher.id
      get :archived_classroom_manager_data
      expect(response.body).to eq({
        active: visible_classrooms.map(&:archived_classrooms_manager),
        inactive: archived_classrooms.map(&:archived_classrooms_manager), 
        coteachers: teacher.classrooms_i_own_that_have_coteachers
      }.to_json)
    end
  end

end
