require 'rails_helper'

feature 'Activity Listing Progress Report', js: true do
  before(:each) { vcr_ignores_localhost }

  let(:mr_kotter) { FactoryGirl.create :mr_kotter }
  let(:report_page) { Teachers::ActivityProgressReportPage.new }

  # TODO: This should be a shared context.
  let(:activity) { FactoryGirl.create(:activity) }
  let(:sweathogs) { FactoryGirl.create(:sweathogs, teacher: mr_kotter) }
  # Absolutely no way that this could get confusing.
  let(:sweatdogs) { FactoryGirl.create(:classroom, name: "Sweatdogs", teacher: mr_kotter)}
  let!(:horshack) { FactoryGirl.create(:arnold_horshack, classroom: sweathogs) }
  let!(:barbarino) { FactoryGirl.create(:vinnie_barbarino, classroom: sweatdogs) }
  let(:sweathogs_classroom_activity) { FactoryGirl.create(:classroom_activity,
    classroom: sweathogs, unit: sweathogs.units.first, activity: activity) }
  let(:sweatdogs_classroom_activity) { FactoryGirl.create(:classroom_activity,
    classroom: sweatdogs, unit: sweatdogs.units.first, activity: activity) }

  let!(:horshack_session) do
    horshack.activity_sessions.create!(
      state: 'finished',
      time_spent: 120,
      percentage: 0.75,
      classroom_activity: sweathogs_classroom_activity
    )
  end
  let!(:barbarino_session) do
    barbarino.activity_sessions.create!(
      state: 'finished',
      time_spent: 120,
      percentage: 0.75,
      classroom_activity: sweatdogs_classroom_activity
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
          horshack_session.completed_at.to_formatted_s(:quill_default),
          '2 minutes',
          'topic', # Derived from topic #
          '75%',
          horshack.name
        ]
      )
    end

    it 'can filter by classroom' do
      report_page.filter_by_classroom(sweatdogs.name)
      expect(report_page.table_rows.size).to eq(1)
    end
  end
end