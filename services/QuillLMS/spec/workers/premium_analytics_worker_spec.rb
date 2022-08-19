# frozen_string_literal: true

require 'rails_helper'

describe PremiumAnalyticsWorker do
  subject { described_class.new }

  let(:analyzer) { double(:analyzer, track: true) }

  before { allow(Analyzer).to receive(:new) { analyzer } }

  describe '#perform' do
    let!(:user) { create(:user) }

    context 'when account type is a teacher premium type' do
      it 'should track teacher began premium' do
        expect(analyzer).to receive(:track_with_attributes).with(user, SegmentIo::BackgroundEvents::TEACHER_BEGAN_PREMIUM, properties: user.segment_user.premium_params)
        subject.perform(user.id, Subscription::OFFICIAL_TEACHER_TYPES[0])
      end
    end

    context 'when account type is a school premium type' do
      it 'should track teacher began premium' do
        expect(analyzer).to receive(:track_with_attributes).with(user, SegmentIo::BackgroundEvents::TEACHER_BEGAN_PREMIUM, properties: user.segment_user.premium_params)
        subject.perform(user.id, Subscription::OFFICIAL_SCHOOL_TYPES[0])
      end
    end

    context 'when account type is a trial premium type' do
      it 'should track teacher began premium' do
        expect(analyzer).to receive(:track_with_attributes).with(user, SegmentIo::BackgroundEvents::TEACHER_BEGAN_PREMIUM, properties: user.segment_user.premium_params)
        subject.perform(user.id, Subscription::OFFICIAL_FREE_TYPES[0])
      end
    end

    context 'when passed an id for a non-existent user' do
      it 'should return without doing anything' do
        bad_user_id = user.id * 9
        expect(analyzer).not_to receive(:track_with_attributes)
        subject.perform(bad_user_id, Subscription::OFFICIAL_FREE_TYPES[0])
      end
    end
  end
end
