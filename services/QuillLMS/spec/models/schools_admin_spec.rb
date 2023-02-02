# frozen_string_literal: true

require 'rails_helper'

describe SchoolsAdmins, type: :model, redis: true do
  it { should belong_to(:school) }
  it { should belong_to(:user) }

  let(:user) { create(:user, email: 'test@quill.org') }

  describe '#admin' do
    let(:admins) { create(:schools_admins, user: user) }

    it 'should return the user associated' do
      expect(admins.admin).to eq(admins.user)
    end
  end

  describe '#set_user_role' do
    let(:school) { create(:school) }

    it 'should set the User.role value to "admin" if it is not already set' do
      expect(user).to receive(:update).with(role: User::ADMIN)

      SchoolsAdmins.create(school: school, user: user)
    end

    it 'should not make any changes if the User.role is already "admin"' do
      user.update(role: User::ADMIN)
      expect(user).not_to receive(:update).with(role: User::ADMIN)

      SchoolsAdmins.create(school: school, user: user)
    end
  end
end
