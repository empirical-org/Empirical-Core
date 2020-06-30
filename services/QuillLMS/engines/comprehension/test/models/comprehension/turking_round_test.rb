require 'test_helper'

module Comprehension
  class TurkingRoundTest < ActiveSupport::TestCase
    context 'validations' do
      should validate_presence_of(:activity_id)

      should validate_presence_of(:expires_at)
    end

    context 'relationships' do
      should belong_to(:activity)
    end
  end
end
