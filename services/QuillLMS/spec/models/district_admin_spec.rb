# frozen_string_literal: true

# == Schema Information
#
# Table name: district_admins
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  district_id :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_district_admins_on_district_id  (district_id)
#  index_district_admins_on_user_id      (user_id)
#
require 'rails_helper'

describe DistrictAdmin, type: :model, redis: true do
  it { should belong_to(:district) }
  it { should belong_to(:user) }

  it { is_expected.to callback(:attach_to_subscribed_schools).after(:create) }
  it { is_expected.to callback(:detach_from_schools).after(:destroy) }

  let(:user) { create(:user, email: 'test@quill.org') }
  let(:district) { create(:district) }
  let(:school) { create(:school, district: district) }
  let(:subscription) { create(:subscription, account_type: 'School Paid') }
  let(:admins) { create(:district_admin, user: user, district: district) }

  describe '#admin' do
    it 'should return the user associated' do
      expect(admins.admin).to eq(admins.user)
    end
  end

  describe '#attach_to_subscribed_schools' do
    it 'should kick off background job to send email' do
      create(:school_subscription, school_id: school.id, subscription_id: subscription.id)
      expect{ admins.attach_to_subscribed_schools }.to change(NewAdminEmailWorker.jobs, :size)
      expect(SchoolsAdmins.find_by(user: user, school: school)).to be
    end

    it 'should not create another record if user is already an admin' do
      create(:school_subscription, school_id: school.id, subscription_id: subscription.id)
      admins.attach_to_subscribed_schools
      expect(SchoolsAdmins.where(user: user, school: school).count).to eq(1)

      expect{ admins.attach_to_subscribed_schools }.not_to change(NewAdminEmailWorker.jobs, :size)
      expect(SchoolsAdmins.where(user: user, school: school).count).to eq(1)
    end
  end

  describe '#detach_from_schools' do
    it 'should remove existing schools admins relationships' do
      create(:school_subscription, school_id: school.id, subscription_id: subscription.id)
      admins.attach_to_subscribed_schools
      expect(SchoolsAdmins.find_by(user: user, school: school)).to be
      admins.detach_from_schools
      expect(SchoolsAdmins.find_by(user: user, school: school)).not_to be
    end
  end
end
