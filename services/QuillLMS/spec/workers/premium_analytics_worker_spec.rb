# frozen_string_literal: true

require 'rails_helper'

describe PremiumAnalyticsWorker do
  subject { described_class.new }

  let(:analyzer) { double(:analyzer, track: true) }

  before { allow(Analyzer).to receive(:new) { analyzer } }

  describe '#perform' do
    let!(:user) { create(:user) }

    context 'when account type is a teacher premium type' do
      it 'should track began teacher premium' do
        expect(analyzer).to receive(:track).with(user, SegmentIo::BackgroundEvents::BEGAN_TEACHER_PREMIUM)
        subject.perform(user.id, Subscription::OFFICIAL_TEACHER_TYPES[0])
      end
    end

    context 'when account type is a school premium type' do
      it 'should track began school premium' do
        expect(analyzer).to receive(:track).with(user, SegmentIo::BackgroundEvents::BEGAN_SCHOOL_PREMIUM)
        subject.perform(user.id, Subscription::OFFICIAL_SCHOOL_TYPES[0])
      end
    end

    context 'when account type is a trial premium type' do
      it 'should track began trial premium' do
        expect(analyzer).to receive(:track).with(user, SegmentIo::BackgroundEvents::BEGAN_PREMIUM_TRIAL)
        subject.perform(user.id, Subscription::OFFICIAL_FREE_TYPES[0])
      end
    end

    context 'when passed an id for a non-existent user' do
      it 'should return without doing anything' do
        bad_user_id = user.id * 9
        expect(analyzer).not_to receive(:track)
        subject.perform(bad_user_id, Subscription::OFFICIAL_FREE_TYPES[0])
      end
    end
  end
end
