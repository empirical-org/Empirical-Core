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
          'Near Proficiency',
          'Not Proficient',
          'Standards'
        ]
      )
    end

    # it 'displays activity session data in the table' do
    #   expect(report_page.table_rows.first).to eq(
    #     [
    #       activity.classification.name,
    #       activity.name,
    #       horshack_session.completed_at.to_formatted_s(:quill_default),
    #       '2 minutes',
    #       'topic', # Derived from topic #
    #       '78%',
    #       horshack.name
    #     ]
    #   )
    # end

    it 'can export a CSV' do
      report_page.export_csv
    end
  end
end