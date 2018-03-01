require 'rails_helper'

describe Api::V1::ProgressReportsController, type: :controller do
  let(:classroom) { create(:classroom_with_students_and_activities) }
  let(:teacher) { classroom.owner }
  let(:unaffiliated_teacher) { create(:teacher) }
  let(:student) { classroom.students.first }
  let(:unaffiliated_student) { create(:student) }

  context '#activities_scores_by_classroom_data' do
    it 'should return ProgressReports::ActivitiesScoresByClassroom for my classes' do
      session[:user_id] = teacher.id
      get :activities_scores_by_classroom_data
      expect(response.body).to eq({
        data: ProgressReports::ActivitiesScoresByClassroom.results(teacher.classrooms_i_teach.map(&:id))
      }.to_json)
    end
  end

  context '#student_overview_data' do
    it 'should not allow access if no teacher classroom relationship exists' do
      session[:user_id] = unaffiliated_teacher.id
      get :student_overview_data, student_id: student.id, classroom_id: classroom.id
      expect(response).to redirect_to new_session_path
    end

    it 'should not allow access if student is not in classroom' do
      session[:user_id] = teacher.id
      get :student_overview_data, student_id: unaffiliated_student.id, classroom_id: classroom.id
      expect(response).to redirect_to new_session_path
    end

    it 'should return appropriate data' do
      session[:user_id] = teacher.id
      get :student_overview_data, student_id: student.id, classroom_id: classroom.id
      expect(response.body).to eq({
        report_data: ProgressReports::StudentOverview.results(classroom.id, student.id),
        student_data: {
          name: student.name,
          id: student.id,
          last_active: student.last_active
        },
        classroom_name: classroom.name
      }.to_json)
    end
  end
end
