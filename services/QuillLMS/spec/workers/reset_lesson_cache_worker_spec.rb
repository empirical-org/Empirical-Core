# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ResetLessonCacheWorker do
  subject { described_class.new.perform(user_id) }

  let(:redis_key) { "user_id:#{user_id}_lessons_array" }

  context 'when user_id is nil' do
    let(:user_id) { nil }

    it { expect { subject }.not_to raise_error }

    it do
      expect($redis).not_to receive(:del)
      subject
    end
  end

  context 'when user_id is not nil' do
    let(:user_id) { 1 }

    before { $redis.set(redis_key, ["something"]) }

    context 'when user is not present' do
      it do
        expect { subject }.not_to raise_error
      end
    end

    context 'when user is present' do
      let(:user) { create(:user) }
      let(:user_id) { user.id }

      before { allow(User).to receive(:find_by).with(id: user_id).and_return(user) }

      it { expect { subject }.to change { $redis.get(redis_key) }.to('[]') }

      it do
        expect(user).to receive(:set_lessons_cache)
        subject
      end
    end
  end
end
