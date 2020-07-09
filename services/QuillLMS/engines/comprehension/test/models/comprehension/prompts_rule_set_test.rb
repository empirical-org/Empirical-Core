require 'test_helper'

module Comprehension
  class PromptsRuleSetTest < ActiveSupport::TestCase
    context 'relations' do
      should belong_to(:prompt)
      should belong_to(:rule_set)
    end
  end
end
