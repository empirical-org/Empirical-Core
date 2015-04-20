require 'rails_helper'

feature 'Students for Standard Progress Report', js: true do
  before(:each) { vcr_ignores_localhost }
  include_context 'Topic Progress Report'

  let(:report_page) { Teachers::StudentsForStandardProgressReportPage.new(full_classroom, first_grade_topic) }

  context 'for a logged-in teacher' do
    before do
      sign_in_user teacher
      report_page.visit
    end

    it 'displays the right headers' do
      expect(report_page.column_headers).to eq(
        [
          'Student Name',
          'Activities',
          'Average',
          'Mastery Status'
        ]
      )
    end

    it 'displays student stats in the table' do
      expect(report_page.table_rows.first).to eq(
        [
          alice.name,
          '1', # Only 1 activity
          '70%', # Alice score on the single activity session for that topic
          'Nearly Proficient'
        ]
      )
    end
  end
end