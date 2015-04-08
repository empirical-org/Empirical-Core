require 'rails_helper'

feature 'Activity Listing Progress Report', js: true do
  before(:each) { vcr_ignores_localhost }

  let(:report_page) { Teachers::ActivityProgressReportPage.new }

  include_context 'Activity Progress Report'

  context 'for a logged-in teacher' do
    before do
      sign_in_user mr_kotter
      report_page.visit
    end

    it 'displays the right headers' do
      expect(report_page.column_headers).to eq(
        [
          'Student',
          'Date',
          'Activity',
          'Score',
          'Standard',
          'App',
        ]
      )
    end

    it 'displays activity session data in the table' do
      expect(report_page.table_rows.last).to eq(
        [
          horshack.name,
          horshack_session.completed_at.to_formatted_s(:quill_default),
          activity.name,
          '78%',
          'topic', # Derived from topic #
          activity.classification.name
        ]
      )
    end

    it 'can filter by classroom' do
      report_page.filter_by_classroom(sweatdogs.name)
      expect(report_page.table_rows.size).to eq(1)
    end

    it 'can export a CSV' do
      report_page.export_csv
      # TODO: Should have some UI feedback instead of testing DB changes
    end
  end
end