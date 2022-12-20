# frozen_string_literal: true

require 'rails_helper'

describe SchoolsAdmins, type: :model, redis: true do
  it { should belong_to(:school) }
  it { should belong_to(:user) }

  let(:user) { create(:user, email: 'test@quill.org') }
  let(:admins) { create(:schools_admins, user: user) }

  describe '#admin' do
    it 'should return the user associated' do
      expect(admins.admin).to eq(admins.user)
    end
  end

end
