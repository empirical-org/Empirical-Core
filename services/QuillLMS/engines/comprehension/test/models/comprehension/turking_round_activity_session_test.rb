require 'test_helper'

module Comprehension
  class TurkingRoundActivitySessionTest < ActiveSupport::TestCase


    context 'validations' do
      should validate_presence_of(:activity_session_uid)
      should validate_presence_of(:turking_round_id)

      should validate_uniqueness_of(:activity_session_uid)
    end

    context 'relationships' do
      should belong_to(:turking_round)
    end
  end
end
