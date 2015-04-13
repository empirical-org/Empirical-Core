require 'rails_helper'

feature 'Standards by Student Progress Report', js: true do
  before(:each) { vcr_ignores_localhost }
  include_context 'Topic Progress Report'

  let(:report_page) { Teachers::StandardsByStudentProgressReportPage.new(full_classroom) }

  context 'for a logged-in teacher' do
    before do
      sign_in_user teacher
      report_page.visit
    end

    it 'displays the right headers' do
      expect(report_page.column_headers).to eq(
        [
          'Student',
          'Standards',
          'Proficient',
          'Nearly Proficient',
          'Not Proficient',
          'Activities',
          'Average',
          'Overall Mastery Status'
        ]
      )
    end

    it 'displays activity session data in the table' do
      expect(report_page.table_rows.first).to eq(
        [
          alice.name,
          '2',
          '1 standards', # Alice is proficient in 1 standard and near in 1 other
          '1 standards',
          '0 standards',
          '2', # Has completed 2 activities
          '85%', # Avg score also taken from Topic Progress Report
          'Proficient'
        ]
      )
    end

    it 'links to a single Student View' do
      report_page.click_student_view(0)
      expect(report_page).to have_text('Standards: Alice')
    end

    # it 'can export a CSV' do
    #   report_page.export_csv
    # end
  end
end