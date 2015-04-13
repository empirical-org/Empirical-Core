require 'rails_helper'

feature 'Standards: All Classrooms Progress Report', js: true do
  before(:each) { vcr_ignores_localhost }

  let(:report_page) { Teachers::ClassroomsProgressReportPage.new }

  include_context 'Topic Progress Report'

  context 'for a logged-in teacher' do
    before do
      sign_in_user teacher
      report_page.visit
    end

    it 'displays the right headers' do
      expect(report_page.column_headers).to eq(
        [
          'Class Name',
          '',
          '',
          'Students',
          'Proficient',
          'Nearly Proficient',
          'Not Proficient',
          'Standards'
        ]
      )
    end

    it 'displays activity session data in the table' do
      expect(report_page.table_rows.first).to eq(
        [
          full_classroom.name,
          'Student View',
          'Standard View',
          visible_students.size.to_s,
          "#{proficient_students.size} students",
          "#{near_proficient_students.size} students",
          "#{not_proficient_students.size} students",
          visible_topics.size.to_s
        ]
      )
    end

    it 'links to the Student View for a classroom' do
      report_page.click_student_view(0)
      expect(report_page).to have_text('Standards by Student')
    end

    # it 'can export a CSV' do
    #   report_page.export_csv
    # end
  end
end