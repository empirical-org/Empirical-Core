# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::ProgressReportsController, type: :controller do
  let(:classroom) { create(:classroom_with_students_and_activities) }
  let(:teacher) { classroom.owner }
  let(:unaffiliated_teacher) { create(:teacher) }
  let(:student) { classroom.students.first }
  let(:unaffiliated_student) { create(:student) }
  let(:admin) { create(:teacher) }

  context '#activities_scores_by_classroom_data' do
    it 'should return ProgressReports::ActivitiesScoresByClassroom for my classes' do
      session[:user_id] = teacher.id
      get :activities_scores_by_classroom_data, as: :json
      expect(response.body).to eq({
        data: ProgressReports::ActivitiesScoresByClassroom.results(teacher.classrooms_i_teach.map(&:id))
      }.to_json)
    end
  end

  context '#student_overview_data' do
    context 'StudentsClassrooms instance does not exist' do
      it 'should not double render' do
        session[:user_id] = teacher.id
        get :student_overview_data, params: { student_id: unaffiliated_student.id, classroom_id: classroom.id+1 }, as: :json
        expect(response).to redirect_to new_session_path
      end
    end

    it 'should not allow access if no teacher classroom relationship exists' do
      session[:user_id] = unaffiliated_teacher.id
      get :student_overview_data, params: { student_id: student.id, classroom_id: classroom.id }, as: :json
      expect(response).to redirect_to new_session_path
    end

    it 'should not allow access if student is not in classroom' do
      session[:user_id] = teacher.id
      get :student_overview_data, params: { student_id: unaffiliated_student.id, classroom_id: classroom.id }, as: :json
      expect(response).to redirect_to new_session_path
    end

    it 'should not allow access if teacher is admin but not admin of that school' do
      session[:user_id] = admin.id
      get :student_overview_data, params: { student_id: student.id, classroom_id: classroom.id }, as: :json
      expect(response).to redirect_to new_session_path
    end

    it 'should return appropriate data' do
      session[:user_id] = teacher.id
      get :student_overview_data, params: { student_id: student.id, classroom_id: classroom.id }, as: :json
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

    it 'should successfully return fresh and cached payloads' do
      # Storing payload data here before setting our 'call once' expectaton to confirm caching
      report_results = ProgressReports::StudentOverview.results(classroom.id, student.id)

      expect(ProgressReports::StudentOverview).to receive(:results).with(classroom.id, student.id).once.and_return(report_results)

      session[:user_id] = teacher.id
      2.times do
        get :student_overview_data, params: { student_id: student.id, classroom_id: classroom.id }, as: :json
        expect(response.status).to eq(200)
        expect(response.body).to eq({
          report_data: report_results,
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

  describe '#district_activity_scores' do
    before do
      allow(teacher).to receive(:admin?) { true }
      allow(controller).to receive(:current_user) { teacher }
      allow_any_instance_of(ProgressReports::DistrictActivityScores).to receive(:results) { "some data" }
    end

    it 'should return the district activit scores progress reports' do
      get :district_activity_scores, as: :json
      expect(response.body).to eq({id: teacher.id}.to_json)
    end
  end

  describe '#district_concept_reports' do
    before do
      allow(teacher).to receive(:admin?) { true }
      allow(controller).to receive(:current_user) { teacher }
      allow_any_instance_of(ProgressReports::DistrictConceptReports).to receive(:results) { "some data" }
    end

    it 'should return the district activity scores progress reports' do
      get :district_concept_reports, as: :json
      expect(response.body).to eq({id: teacher.id}.to_json)
    end
  end

  describe '#district_standards_reports' do
    before do
      allow(teacher).to receive(:admin?) { true }
      allow(controller).to receive(:current_user) { teacher }
      allow_any_instance_of(ProgressReports::DistrictStandardsReports).to receive(:results) { "some data" }
    end

    it 'should return the district activit scores progress reports' do
      get :district_standards_reports, as: :json
      expect(response.body).to eq({id: teacher.id}.to_json)
    end
  end
end
