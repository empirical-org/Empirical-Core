# frozen_string_literal: true

# == Schema Information
#
# Table name: school_subscriptions
#
#  id              :integer          not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  school_id       :integer
#  subscription_id :integer
#
# Indexes
#
#  index_school_subscriptions_on_school_id        (school_id)
#  index_school_subscriptions_on_subscription_id  (subscription_id)
#
require 'rails_helper'

describe SchoolSubscription, type: :model do
  let!(:school_sub) {create(:school_subscription)}

  it { should validate_presence_of(:school_id) }
  it { should validate_presence_of(:subscription_id) }

  it { should belong_to(:school) }
  it { should belong_to(:subscription) }
  it { is_expected.to callback(:update_schools_users).after(:commit) }

  describe "presence of" do
    it "school_id" do
      expect{school_sub.update!(school_id: nil)}.to raise_error(ActiveRecord::RecordInvalid)
    end
  end

  context '#update_schools_users' do
    let(:user) { create(:user) }
    let!(:queens_teacher) { create(:teacher, name: 'queens teacher') }
    let!(:queens_school) { create :school, name: "Queens Charter School", zipcode: '11385', users: [queens_teacher, user]}

    let!(:subscription) {create(:subscription, account_type: 'School Paid')}
    let!(:school_sub) {create(:school_subscription, subscription_id: subscription.id, school_id: queens_school.id)}

    it "connects a new premium account to school's users if they do not have one" do
      queens_teacher.user_subscriptions.destroy_all
      expect(queens_teacher.reload.subscription).to eq(nil)
      school_sub.update_schools_users
      expect(queens_teacher.reload.subscription).to eq(school_sub.subscription)
    end

    it "connects a new premium account to school's users if they do have one" do
      queens_teacher.user_subscriptions.destroy_all
      old_sub = Subscription.create_and_attach_subscriber({ account_type: 'paid' }, queens_teacher)
      expect(queens_teacher.reload.subscription).to eq(old_sub)
      school_sub.update_schools_users
      expect(queens_teacher.reload.subscription).to eq(school_sub.subscription)
    end
  end
end
