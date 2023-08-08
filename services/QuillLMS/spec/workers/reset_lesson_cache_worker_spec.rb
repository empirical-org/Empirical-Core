# frozen_string_literal: true

require 'rails_helper'

describe ResetLessonCacheWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }

    before do
      $redis.set("user_id:#{user.id}_lessons_array", ["something"])
    end

    it 'should delete the redis cache and set lesson cache for user' do
      expect_any_instance_of(User).to receive(:set_lessons_cache)
      subject.perform(user.id)
      expect($redis.get("user_id:#{user.id}_lessons_array")).to eq nil
    end
  end
end
