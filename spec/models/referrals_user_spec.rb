require 'rails_helper'

RSpec.describe ReferralsUser, type: :model do
  context 'associations' do
    let(:referrals_user) { create(:referrals_user) }
    let(:referring_user) { referrals_user.user }
    let(:referred_user)  { referrals_user.referred_user }

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

  context 'callbacks' do
    let(:segment_analytics) { SegmentAnalytics.new }
    let(:track_calls) { segment_analytics.backend.track_calls }
    let(:identify_calls) { segment_analytics.backend.identify_calls }

    it 'triggers an invited event on create' do
      referrals_user = create(:referrals_user)
      expect(identify_calls.size).to eq(1)
      expect(identify_calls[0][:user_id]).to be(referrals_user.referrer.id)
      expect(track_calls[0][:event]).to be(SegmentIo::Events::REFERRAL_INVITED)
      expect(track_calls[0][:user_id]).to be(referrals_user.referrer.id)
      expect(track_calls[0][:properties][:referral_id]).to be(referrals_user.referral.id)
    end

    it 'triggers an activated event when activated becomes true' do
      referrals_user = create(:referrals_user)
      referrals_user.update(activated: true)
      expect(identify_calls.size).to eq(2)
      expect(identify_calls[1][:user_id]).to be(referrals_user.referrer.id)
      expect(track_calls[1][:event]).to be(SegmentIo::Events::REFERRAL_ACTIVATED)
      expect(track_calls[1][:user_id]).to be(referrals_user.referrer.id)
      expect(track_calls[1][:properties][:referral_id]).to be(referrals_user.referral.id)
    end
  end
end
