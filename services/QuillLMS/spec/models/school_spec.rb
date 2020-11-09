require 'rails_helper'

describe School, type: :model do
  let!(:bk_school) { create :school, name: "Brooklyn Charter School", zipcode: '11206'}
  let!(:queens_school) { create :school, name: "Queens Charter School", zipcode: '11385'}
  let!(:bk_teacher) { create(:teacher, school: bk_school) }
  let!(:bk_teacher_colleague) { create(:teacher, school: bk_school) }
  let!(:queens_teacher) { create(:teacher, school: queens_school) }

  describe('#subscription') do
      let!(:subscription) { create(:subscription, expiration: Date.tomorrow) }
      let!(:school_subscription) {create(:school_subscription, school: bk_school, subscription: subscription)}

    it "returns a subscription if a valid one exists" do
      expect(bk_school.reload.subscription).to eq(subscription)
    end

    it "returns the subscription with the latest expiration date multiple valid ones exists" do
      later_subscription = create(:subscription, expiration: Date.today + 365)
      later_user_sub = create(:school_subscription, school: bk_school, subscription: later_subscription)
      expect(bk_school.reload.subscription).to eq(later_subscription)
    end

    it "returns nil if a valid subscription does not exist" do
      subscription.update(expiration: Date.yesterday)
      expect(bk_school.reload.subscription).to eq(nil)
    end
  end

  describe('#present_and_future_subscriptions') do
    let!(:subscription) { create(:subscription, expiration: Date.tomorrow) }
    let!(:next_subscription) { create(:subscription, expiration: Date.tomorrow + 1.year, start_date: Date.tomorrow) }
    let!(:school_subscription) {create(:school_subscription, school: bk_school, subscription: subscription)}
    let!(:next_school_subscription) {create(:school_subscription, school: bk_school, subscription: next_subscription)}
    let!(:expired_subscription) {create(:subscription, expiration: Date.yesterday, de_activated_date: Date.yesterday)}
    let!(:expired_school_subscription) {create(:school_subscription, school: bk_school, subscription: expired_subscription)}

  it "returns all subscriptions even if they have not started yet" do
    expect(bk_school.present_and_future_subscriptions.size).to eq(2)
  end

  it "returns in ascending order of expiration date" do
    expect(bk_school.present_and_future_subscriptions.first).to eq(subscription)
    expect(bk_school.present_and_future_subscriptions.last).to eq(next_subscription)
  end

  it "does not return deactivated subscriptions" do
    expect(bk_school.present_and_future_subscriptions).not_to include(expired_subscription)
  end
end


  describe 'validations' do
    before do
      @school = School.new
    end

    it 'lower grade is within bounds' do
      @school.lower_grade = 5

      expect(@school.valid?).to eq(true)
    end

    it 'lower grade is out of bounds' do
      @school.lower_grade = -1

      expect(@school.valid?).to eq(false)
      expect(@school.errors[:lower_grade]).to eq(['must be between 0 and 12'])
    end

    it 'upper grade is within bounds' do
      @school.upper_grade = 8

      expect(@school.valid?).to eq(true)
    end

    it 'upper grade is out of bounds' do
      @school.upper_grade = 14

      expect(@school.valid?).to eq(false)
      expect(@school.errors[:upper_grade]).to eq(['must be between 0 and 12'])
    end

    it 'lower grade is below upper grade' do
      @school.lower_grade = 2
      @school.upper_grade = 8

      expect(@school.valid?).to eq(true)
    end

    it 'lower grade is above upper grade' do
      @school.lower_grade = 6
      @school.upper_grade = 3

      expect(@school.valid?).to eq(false)
      expect(@school.errors[:lower_grade]).to eq(['must be less than or equal to upper grade'])
    end

  end

  describe('school_year_start method') do
    it 'fetches 08-01 of this year if the date is after 08-01' do
      time = Date.parse('2020-08-01')
      expect(School.school_year_start(time)).to eq(time.beginning_of_day)
    end

    it 'fetches 08-01 of last year if the date is before 08-01' do
      time = Date.parse('2020-07-01')
      expect(School.school_year_start(time)).to eq(Date.parse('2019-08-01').beginning_of_day)
    end
  end

end
