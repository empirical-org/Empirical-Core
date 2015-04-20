require 'rails_helper'

feature 'Standards for Student Progress Report', js: true do
  before(:each) { vcr_ignores_localhost }
  include_context 'Topic Progress Report'

  let(:report_page) { Teachers::StandardsForStudentProgressReportPage.new(full_classroom, alice) }

  context 'for a logged-in teacher' do
    before do
      sign_in_user teacher
      report_page.visit
    end

    it 'displays the right headers' do
      expect(report_page.column_headers).to eq(
        [
          'Standard Level',
          'Standard Name',
          'Activities',
          'Average',
          'Mastery Status'
        ]
      )
    end

    it 'displays topic stats in the table' do
      expect(report_page.table_rows.first).to eq(
        [
          section.name,
          first_grade_topic.name,
          '1', # Only 1 activity
          '70%', # Alice score on the single activity session for that topic
          'Nearly Proficient'
        ]
      )
    end

    # it 'can export a CSV' do
    #   report_page.export_csv
    # end
  end
end