module Comprehension
  class PromptsRuleSet < ActiveRecord::Base
    belongs_to :prompt
    belongs_to :rule_set
  end
end

