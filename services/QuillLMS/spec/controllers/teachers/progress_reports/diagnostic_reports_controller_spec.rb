require 'rails_helper'

describe Teachers::ProgressReports::DiagnosticReportsController, type: :controller do
  include_context "Unit Assignments Variables"
  let(:activity) { create(:diagnostic_activity) }
  let(:unit) {create(:unit)}
  let(:classroom) {create(:classroom)}

  before { session[:user_id] = teacher.id }

  describe 'getting the report for a completed activity session' do
    describe 'updating existing recommendations' do
      let(:unit) {create(:unit)}
      let(:activity) { create(:activity)}
      let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom) }
      let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity)}
      let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: activity, user: student) }

      it "redirects to the correct page" do
        get :report_from_classroom_unit_activity_and_user, ({classroom_unit_id: classroom_unit.id, user_id: student.id, activity_id: activity.id})
        expect(response).to redirect_to("/teachers/progress_reports/diagnostic_reports#/u/#{unit.id}/a/#{activity.id}/c/#{classroom.id}/student_report/#{student.id}")
      end
    end
  end

  context 'lesson_recommendations_for_classroom' do
    before do
      # stub complicated query that returns activities
      LessonRecommendationsQuery.any_instance.stub(:activity_recommendations).and_return([activity])
      @classroom_unit = create(:classroom_unit, classroom: classroom, unit: unit)
    end

    it 'should not error with no activity_sessions' do
      get :lesson_recommendations_for_classroom,
        ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

      expect(response).to be_success
    end

    it 'should not error with activity_sessions' do
      create(:activity_session, classroom_unit: @classroom_unit, activity: activity)
      get :lesson_recommendations_for_classroom, ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

      expect(response).to be_success
    end
  end

  describe 'assign_selected_packs recommendations' do
    let(:unit_template_ids) { [unit_template1, unit_template2, unit_template3, unit_template4].map(&:id) }

    let(:selections) do
       unit_template_ids.map do |unit_template_id|
        {
          id: unit_template_id,
          classrooms: [
            {
              id: classroom.id,
              student_ids: []
            }
          ]
        }
      end
    end

    it 'creates units but does not create new classroom activities if passed no students ids' do
      post "assign_selected_packs",
        params: { selections: selections },
        as: :json

      expect(unit_templates_have_a_corresponding_unit?(unit_template_ids)).to eq(true)
      expect(units_have_corresponding_unit_activities?(unit_template_ids)).to eq(false)
    end
  end
end
