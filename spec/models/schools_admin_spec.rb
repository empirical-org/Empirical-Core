require 'rails_helper'

describe SchoolsAdmins, type: :model, redis: true do
  it { should belong_to(:school) }
  it { should belong_to(:user) }

  it { is_expected.to callback(:send_admin_email).after(:create) }

  let(:user) { create(:user, email: 'test@quill.org') }
  let(:admins) { create(:schools_admins, user: user) }

  describe '#admin' do
    it 'should return the user associated' do
      expect(admins.admin).to eq(admins.user)
    end
  end

  describe '#send_admin_email' do
    it 'should kick off background job to send email' do
      expect{ admins.send_admin_email }.to change(NewAdminEmailWorker.jobs, :size)
    end
  end
end
