require 'test_helper'

module Comprehension
  class TurkingRoundTest < ActiveSupport::TestCase
    context 'validations' do
      setup do
        create(:comprehension_turking_round)
      end

      should validate_presence_of(:activity_id)
      should validate_presence_of(:expires_at)

      should have_readonly_attribute(:uuid)
      should validate_uniqueness_of(:uuid)

      should 'validate presence of uuid on any update call' do
        turking_round = create(:comprehension_turking_round)
        turking_round.uuid = nil
        refute turking_round.valid?
        assert turking_round.errors[:uuid].include?("can't be blank")
      end

      should 'set a default uuid when creating a new record' do
        turking_round = create(:comprehension_turking_round, uuid: nil)

        assert_not_nil turking_round.uuid
      end

      should 'ensure expires_at is a future date on create' do
        turking_round = build(:comprehension_turking_round, expires_at: 1.month.ago)
        refute turking_round.valid?
        assert turking_round.errors[:expires_at].include?('must be in the future')
      end

      should 'allow updates to expires_at to be in the past even though creates should not' do
        turking_round = create(:comprehension_turking_round)
        turking_round.expires_at = 1.second.ago
        assert turking_round.valid?
      end
    end

    context 'relationships' do
      should belong_to(:activity)
    end
  end
end
