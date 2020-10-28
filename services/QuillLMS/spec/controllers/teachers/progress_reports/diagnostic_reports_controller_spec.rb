require 'rails_helper'
describe Teachers::ProgressReports::DiagnosticReportsController, type: :controller do
include_context "Unit Assignments Variables"
  let(:activity) { create(:diagnostic_activity) }
  let(:unit) {create(:unit)}
  let(:classroom) {create(:classroom)}

  before do
    session[:user_id] = teacher.id
  end

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
      get :lesson_recommendations_for_classroom, ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

      expect(response).to be_success
    end

    it 'should not error with activity_sessions' do
      create(:activity_session, classroom_unit: @classroom_unit, activity: activity, is_final_score: false)
      get :lesson_recommendations_for_classroom, ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

      expect(response).to be_success
    end
  end

  describe 'assign_selected_packs recommendations' do

      it 'can create new units and classroom activities' do
        # moved to background worker
          # data = {"selections":[
          #           {"id":unit_template1.id,"classrooms":[{"id":classroom.id,"student_ids":[144835]}]},
          #           {"id":unit_template2.id,"classrooms":[{"id":classroom.id,"student_ids":[144835, 144836]}]},
          #           {"id":unit_template3.id,"classrooms":[{"id":classroom.id,"student_ids":[144835, 144836, 144837]}]},
          #           {"id":unit_template4.id,"classrooms":[{"id":classroom.id,"student_ids":[144835, 144836, 144837, 144838]}]}
          #         ]}
          # post "assign_selected_packs", (data)
          # unit_template_ids = data[:selections].map{ |sel| sel[:id] }
          # expect(unit_templates_have_a_corresponding_unit?(unit_template_ids)).to eq(true)
          # expect(units_have_corresponding_unit_activities?(unit_template_ids)).to eq(true)
      end

      it 'creates units but does not create new classroom activities if passed no students ids' do
        data = {"selections":[
                  {"id":unit_template1.id,"classrooms":[{"id":classroom.id,"student_ids":[]}]},
                  {"id":unit_template2.id,"classrooms":[{"id":classroom.id,"student_ids":[]}]},
                  {"id":unit_template3.id,"classrooms":[{"id":classroom.id,"student_ids":[]}]},
                  {"id":unit_template4.id,"classrooms":[{"id":classroom.id,"student_ids":[]}]}
                ]}
        post "assign_selected_packs", (data)
        unit_template_ids = data[:selections].map{ |sel| sel[:id] }
        expect(unit_templates_have_a_corresponding_unit?(unit_template_ids)).to eq(true)
        expect(units_have_corresponding_unit_activities?(unit_template_ids)).to eq(false)
      end

      it 'can update existing units without duplicating them' do
        #  moved to background worker
          #
          # old_data = {"selections":[
          #               {"id":unit_template3.id,"classrooms":[{"id":classroom.id,"student_ids":[student1.id]}]}
          #             ]}
          # post "assign_selected_packs", (old_data)
          #
          # new_data = {"selections":[
          #               {"id":unit_template3.id,"classrooms":[{"id":classroom.id,"student_ids":[student1.id, student2.id]}]}
          #             ]}
          #
          # post "assign_selected_packs", (new_data)
          #
          # expect(Unit.where(name: unit_template3.name).count).to eq(1)
          # expect(Unit.find_by_name(unit_template3.name)
          #       .classroom_activities.map(&:assigned_student_ids).flatten.uniq.sort)
          #       .to eq(new_data[:selections].first[:classrooms].first[:student_ids].sort)
      end

    end



    # describe 'for an existing unit' do
    #
    #   it "updates packs with new student ids if they should be updated" do
    #
    #   end
    #
    #   describe "does not duplicate the original" do
    #     it "unit" do
    #
    #     end
    #
    #     it "classroom activities" do
    #
    #     end
    #
    #     it "activity sessions" do
    #
    #     end
    #
    #   end
    #
    #   describe "if necessary, it assigns new" do
    #     it "activity packs" do
    #
    #     end
    #     it "classroom activities" do
    #
    #     end
    #
    #     it "activity sessions" do
    #
    #     end
    #   end
    #
    #
    # end





end
