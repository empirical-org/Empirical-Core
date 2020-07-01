require 'test_helper'

module Comprehension
  class TurkingRoundTest < ActiveSupport::TestCase
    context 'validations' do
      should validate_presence_of(:activity_id)
      should validate_presence_of(:expires_at)

      should 'ensure expires_at is a future date on create' do
        activity = create(:comprehension_activity)
        turking_round = TurkingRound.create(activity: activity, expires_at: 1.month.ago)
        assert_equal turking_round.valid?, false
        assert turking_round.errors[:expires_at].include?('must be in the future')
      end

      should 'allow updates with expires_at in the past' do
        turking_round = create(:comprehension_turking_round, expires_at: 1.second.from_now)
        sleep 2
        assert_operator turking_round.expires_at, :<, Time.zone.now
        assert_equal turking_round.valid?, true
      end
    end

    context 'relationships' do
      should belong_to(:activity)
    end
  end
end
