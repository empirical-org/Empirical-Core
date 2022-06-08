# frozen_string_literal: true

# == Schema Information
#
# Table name: district_subscriptions
#
#  id              :bigint           not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  district_id     :bigint
#  subscription_id :bigint
#
# Indexes
#
#  index_district_subscriptions_on_district_id      (district_id)
#  index_district_subscriptions_on_subscription_id  (subscription_id)
#
# Foreign Keys
#
#  fk_rails_...  (district_id => districts.id)
#  fk_rails_...  (subscription_id => subscriptions.id)
#
require 'rails_helper'

describe DistrictSubscription, type: :model do
  let(:district) { create(:district) }
  let(:district_subscription) { create(:district_subscription, district: district) }

  context 'associations' do
    it { expect { district_subscription.update!(district_id: nil) }.to raise_error(ActiveRecord::RecordInvalid) }
    it { expect { district_subscription.update!(subscription_id: nil) }.to raise_error(ActiveRecord::RecordInvalid) }
  end

  context '#create_school_subscriptions' do
    let!(:admin) { create(:admin) }
    let!(:district_admin) { create(:district_admin, user: admin, district: district) }
    let!(:teacher1) { create(:teacher) }
    let!(:teacher2) { create(:teacher) }
    let!(:school1) { create(:school, district: district, admins: [admin], users: [teacher1]) }
    let!(:school2) { create(:school, district: district, admins: [admin], users: [teacher2]) }

    before { district.reload }

    subject { district_subscription }

    context 'no teacher subscriptions exists' do
      it { expect { subject }.to change(DistrictSubscription, :count).by(1) }
      it { expect { subject }.to change(SchoolSubscription, :count).by(2) }
      it { expect { subject }.to change(UserSubscription, :count).by(2) }
    end

    context 'teacher already has subscription but is assigned to school with school subscription' do
      let!(:teacher3) { create(:teacher) }
      let!(:subscription) { create(:user_subscription, user: teacher3).subscription }
      let!(:amount) { (subscription.expiration - subscription.start_date).to_i }

      before { create(:schools_users, school: school1, user: teacher3) }

      it 'gives user premium credits' do
        expect(CreditTransaction).to receive(:create).with(user_id: teacher3.id, amount: amount, source: subscription)
        subject
      end

      it 'deactivates the teacher subscription' do
        expect { subject }.to change { subscription.reload.de_activated_date }.from(nil)
      end
    end
  end
end
