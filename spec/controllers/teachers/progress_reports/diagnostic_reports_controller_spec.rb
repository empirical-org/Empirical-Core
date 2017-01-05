require 'rails_helper'

describe Teachers::ProgressReports::DiagnosticReportsController, type: :controller do

  let(:teacher) { FactoryGirl.create(:teacher) }
  let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:unit) {FactoryGirl.create(:unit)}
  let(:student) {FactoryGirl.create(:student)}
  let(:activity) {FactoryGirl.create(:activity)}
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

  describe 'assign_selected_packs' do
    # describe 'for an existing unit'
    #   it "updates packs with new student ids if they should be updated" do
    #
    #   end
    #
    #   describe "does not duplicate the original" do
    #     it "unit" do
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
    #
    # describe 'for a new unit'
    #   it "updates packs with new student ids if they should be updated" do
    #
    #   end
    #
    #   it "does not duplicate the original unit" do
    #
    #   end
    # end
  end


end
