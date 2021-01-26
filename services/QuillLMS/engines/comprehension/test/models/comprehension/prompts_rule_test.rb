require 'test_helper'

module Comprehension
  class PromptsRuleTest < ActiveSupport::TestCase


    context 'relationships' do
      should belong_to(:prompt)
      should belong_to(:rule)
    end
  end
end
