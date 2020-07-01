require 'test_helper'

module Comprehension
  class TurkingRoundTest < ActiveSupport::TestCase
    context 'validations' do
      should validate_presence_of(:activity_id)
      should validate_presence_of(:expires_at)

      should 'enforce uuid uniqueness' do
        activity = create(:comprehension_activity)
        turking_round = create(:comprehension_turking_round)
        new_turking_round = TurkingRound.create(activity: turking_round.activity, uuid: turking_round.uuid, expires_at: turking_round.expires_at)

        assert !new_turking_round.valid?
        assert new_turking_round.errors[:uuid].include?('has already been taken')
      end

      should 'validate presence of uuid on any update call' do
        turking_round = create(:comprehension_turking_round)
        turking_round.uuid = nil
        assert_equal turking_round.valid?, false
        assert turking_round.errors[:uuid].include?("can't be blank")
      end

      should 'set a default uuid when creating a new record' do
        activity = create(:comprehension_activity)
        turking_round = TurkingRound.create(activity: activity, expires_at: 1.month.from_now)

        assert_not_nil turking_round.uuid
      end

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
