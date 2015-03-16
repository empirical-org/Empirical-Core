require 'rails_helper'

feature 'Activity Listing Progress Report', js: true do
  before(:each) { vcr_ignores_localhost }

  let(:mr_kotter) { FactoryGirl.create :mr_kotter }
  let(:report_page) { Teachers::ActivityProgressReportPage.new }

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
  end
end