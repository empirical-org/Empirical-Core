require 'rails_helper'

feature 'Subscription to Progress Report', js: true do
  before(:each) { vcr_ignores_localhost }

  let!(:report_page) { Teachers::ActivityProgressReportPage.new }

  let!(:teacher) { FactoryGirl.create :user, role: 'teacher'}

  let!(:activity) { FactoryGirl.create(:activity) }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let!(:student) { FactoryGirl.create(:arnold_horshack, classroom: classroom) }
  let!(:unit) {FactoryGirl.create(:unit)}
  let!(:classroom_activity) { FactoryGirl.create(:classroom_activity,
    classroom: classroom, unit: unit, activity: activity) }



  let!(:activity_session) {
    FactoryGirl.create(:activity_session,
                             user: student,
                             state: 'finished',
                             percentage: 1,
                             classroom_activity: classroom_activity,
                             completed_at: Date.today)
  }


  def trial_message
    "As a Quill Premium trial user"
  end

  def expired_trial_message
    "trial has expired"
  end

  before do
    sign_in_user teacher
  end

  context 'no subscription' do
    context 'trial is not expired' do
      before do
        report_page.visit
      end

      it 'displays activity session data' do
        expect(report_page).to have_content(student.name)
      end

      it 'displays trial message' do
        expect(report_page).to have_content(trial_message)
      end
    end



    context 'trial is expired' do

      before do
        allow_any_instance_of(Teacher).to receive(:is_trial_expired?).and_return(true)
        report_page.visit
      end

      it 'does not show activity session data' do
        expect(report_page).to_not have_content(student.name)
      end

      it 'shows expired trial message' do
        expect(report_page).to have_content(expired_trial_message)
      end
    end

  end

  context 'has subscription' do
    let!(:subscription) {FactoryGirl.create(:subscription, user: teacher, expiration: Date.tomorrow, account_limit: 5)}

    before do
      report_page.visit
    end

    it 'displays activity session data' do
      expect(report_page.table_rows.first.first).to eq(student.name)
    end

    it 'does not display trial message' do
      expect(report_page).to_not have_content(trial_message)
    end

    it 'does not display premium tab' do
      expect(report_page).to_not have_css('.premium-tab')
    end
  end
end
