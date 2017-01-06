require 'rails_helper'

describe Teachers::ProgressReports::DiagnosticReportsController, type: :controller do




  let(:teacher) { FactoryGirl.create(:teacher) }
  let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:unit) {FactoryGirl.create(:unit)}
  let(:student) {FactoryGirl.create(:student)}
  let(:student1) {FactoryGirl.create(:student)}
  let(:student2) {FactoryGirl.create(:student)}
  let(:activity) {FactoryGirl.create(:activity)}
  let(:activity1) {FactoryGirl.create(:activity)}
  let(:activity2) {FactoryGirl.create(:activity)}
  let(:activity3) {FactoryGirl.create(:activity)}
  let(:activity4) {FactoryGirl.create(:activity)}
  let!(:unit_template1) { FactoryGirl.create(:unit_template, activities: [activity1] )}
  let!(:unit_template2) { FactoryGirl.create(:unit_template, activities: [activity2]) }
  let!(:unit_template3) { FactoryGirl.create(:unit_template, activities: [activity3]) }
  let!(:unit_template4) { FactoryGirl.create(:unit_template, activities: [activity4]) }
  let(:classroom_activity) { FactoryGirl.create(:classroom_activity, activity_id: activity.id, classroom_id: classroom.id, unit_id: unit.id, assigned_student_ids: [student.id])}
  let(:activity_session) {FactoryGirl.create(:activity_session, classroom_activity_id: classroom_activity.id, activity_id: activity.id, user_id: student.id, state: 'finished')}


  before do
    session[:user_id] = teacher.id
  end

  describe 'getting the report for a completed activity session' do

    describe 'updating existing recommendations' do
      it "returns a json with the url" do
          get :report_from_activity_session, ({activity_session: activity_session.id})
          response_body = JSON.parse(response.body)
          expect(response_body["url"]).to eq("/teachers/progress_reports/diagnostic_reports#/u/#{unit.id}/a/#{activity.id}/c/#{classroom.id}/student_report/#{student.id}")
      end
    end
  end

  describe 'assign_selected_packs recommendations' do
      def unit_templates_have_a_corressponding_unit?
        Unit.all.map(&:name).sort == UnitTemplate.all.map(&:name)
      end

      def units_have_a_corresponding_classroom_activities?
        UnitTemplate.all.map(&:name) == ClassroomActivity.all.map(&:unit).map(&:name).flatten
      end

      it 'can create new units and classroom activities' do
          data = {"selections":[
                    {"id":unit_template1.id,"classrooms":[{"id":classroom.id,"student_ids":[]}]},
                    {"id":unit_template2.id,"classrooms":[{"id":classroom.id,"student_ids":[]}]},
                    {"id":unit_template3.id,"classrooms":[{"id":classroom.id,"student_ids":[144835]}]}
                  ]}
          post "assign_selected_packs", (data)

          expect(unit_templates_have_a_corressponding_unit?).to eq(true)
          expect(units_have_a_corresponding_classroom_activities?).to eq(true)
      end

      it 'can update existing units without duplicating them' do

          old_data = {"selections":[
                        {"id":unit_template3.id,"classrooms":[{"id":classroom.id,"student_ids":[student1.id]}]}
                      ]}
          post "assign_selected_packs", (old_data)

          new_data = {"selections":[
                        {"id":unit_template3.id,"classrooms":[{"id":classroom.id,"student_ids":[student1.id, student2.id]}]}
                      ]}

          post "assign_selected_packs", (new_data)

          expect(Unit.where(name: unit_template3.name).count).to eq(1)
          expect(Unit.find_by_name(unit_template3.name)
                .classroom_activities.map(&:assigned_student_ids).flatten.uniq.sort)
                .to eq(new_data[:selections].first[:classrooms].first[:student_ids].sort)
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
