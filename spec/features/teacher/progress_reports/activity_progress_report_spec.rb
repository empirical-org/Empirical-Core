require 'rails_helper'

feature 'Activity Listing Progress Report', js: true do
  before(:each) { vcr_ignores_localhost }

  let(:mr_kotter) { FactoryGirl.create :mr_kotter }
  let(:report_page) { Teachers::ActivityProgressReportPage.new }

  # TODO: Copied from activity_sessions_controller_spec. Would make
  # more sense as a shared_context
  let(:activity) { FactoryGirl.create(:activity) }
  let(:classroom) { FactoryGirl.create(:classroom, teacher: mr_kotter) }
  let!(:student) { FactoryGirl.create(:arnold_horshack, classroom: classroom) }
  let(:classroom_activity) { FactoryGirl.create(:classroom_activity,
    classroom: classroom, unit: classroom.units.first, activity: activity) }
  let!(:activity_session) do
    student.activity_sessions.create!(
      state: 'finished',
      time_spent: 120,
      percentage: 0.75,
      classroom_activity: classroom_activity
    )
  end

  context 'for a logged-in teacher' do
    before do
      sign_in_user mr_kotter
      report_page.visit
    end

    it 'displays the right headers' do
      expect(report_page.column_headers).to eq(
        [
          'App',
          'Activity',
          'Date',
          'Time Spent',
          'Standard',
          'Score',
          'Student'
        ]
      )
    end

    it 'displays activity session data in the table' do
      expect(report_page.table_rows.first).to eq(
        [
          activity.classification.name,
          activity.name,
          activity_session.completed_at.to_formatted_s(:quill_default),
          '2 minutes',
          'topic', # Derived from topic #
          '75%',
          student.name
        ]
      )
    end
  end
end