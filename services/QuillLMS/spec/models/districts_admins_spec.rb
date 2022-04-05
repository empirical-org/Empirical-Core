# frozen_string_literal: true

require 'rails_helper'

describe DistrictsAdmins, type: :model, redis: true do
  it { should belong_to(:district) }
  it { should belong_to(:user) }

  it { is_expected.to callback(:send_admin_email).after(:create) }

  let(:user) { create(:user, email: 'test@quill.org') }
  let(:district) { create(:district) }
  let(:school) { create(:school, district: district) }
  let(:subscription) { create(:subscription, account_type: 'School Paid') }
  let(:admins) { create(:districts_admins, user: user, district: district) }

  describe '#admin' do
    it 'should return the user associated' do
      expect(admins.admin).to eq(admins.user)
    end
  end

  describe '#send_admin_email' do
    it 'should kick off background job to send email' do
      create(:school_subscription, school_id: school.id, subscription_id: subscription.id)
      expect{ admins.send_admin_email }.to change(NewAdminEmailWorker.jobs, :size)
    end
  end
end
