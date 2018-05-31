require 'rails_helper'

RSpec.describe ReferrerUser, type: :model do
  let!(:teacher) { create(:teacher) }
  let!(:referrer_user) { teacher.referrer_user }

  context 'associations' do
    it 'returns the right user' do
      expect(referrer_user.user).to be(teacher)
    end
  end

  context 'validations' do
    it 'does not allow two of the same users' do
      expect {
        ReferrerUser.create!(user_id: teacher.id, referral_code: 'different')
      }.to raise_error ActiveRecord::RecordNotUnique
    end

    it 'does not allow two of the same referral codes' do
      # ReferrerUser.create(user_id: 1, referral_code: 'same')
      expect {
        ReferrerUser.create!(user_id: 2, referral_code: referrer_user.referral_code)
      }.to raise_error ActiveRecord::RecordNotUnique
    end
  end
end
