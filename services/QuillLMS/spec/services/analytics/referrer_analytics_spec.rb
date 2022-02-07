# frozen_string_literal: true

require 'rails_helper'

describe 'ReferrerAnalytics' do
  let(:analytics) { ReferrerAnalytics.new }
  let(:segment_analytics) { SegmentAnalytics.new }
  let(:track_calls) { segment_analytics.backend.track_calls }
  let(:identify_calls) { segment_analytics.backend.identify_calls }
  let(:referrer) { create(:teacher) }
  let(:referral) { create(:teacher) }

  context 'when a referral signs up' do
    before do
      analytics.track_referral_invited(referrer, referral.id)
    end

    it 'identifies the referring teacher' do
      expect(identify_calls.size).to eq(1)
      expect(identify_calls[0][:user_id]).to be(referrer.id)
    end

    it 'sends the event' do
      expect(track_calls[0][:event]).to be(SegmentIo::BackgroundEvents::REFERRAL_INVITED)
      expect(track_calls[0][:user_id]).to be(referrer.id)
      expect(track_calls[0][:properties][:referral_id]).to be(referral.id)
    end
  end

  context 'when a referral becomes active' do
    before do
      analytics.track_referral_activated(referrer, referral.id)
    end

    it 'identifies the referring teacher' do
      expect(identify_calls.size).to be(1)
      expect(identify_calls[0][:user_id]).to be(referrer.id)
    end

    it 'sends the event' do
      expect(track_calls[0][:event]).to be(SegmentIo::BackgroundEvents::REFERRAL_ACTIVATED)
      expect(track_calls[0][:user_id]).to be(referrer.id)
      expect(track_calls[0][:properties][:referral_id]).to be(referral.id)
    end
  end
end
