require 'rails_helper'

RSpec.describe ReferralsUser, type: :model do
  context 'associations' do
    let!(:referrals_user) { create(:referrals_user) }
    let!(:referring_user) { referrals_user.user }
    let!(:referred_user)  { referrals_user.referred_user }

    it 'returns the right user' do
      expect(referrals_user.user).to be(referring_user)
      expect(referrals_user.referring_user).to be(referring_user)
    end

    it 'returns the right referred user' do
      expect(referrals_user.referred_user).to be(referred_user)
    end
  end

  context 'validations' do
    it 'does not allow more than one of the same referred user' do
      referred_user_id = create(:referrals_user).referred_user_id
      expect {
        create(:referrals_user, referred_user_id: referred_user_id)
      }.to raise_error ActiveRecord::RecordNotUnique
    end
  end
end
