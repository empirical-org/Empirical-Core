require("rails_helper")
module Comprehension
  RSpec.describe(RegexMigrationRunner, :type => :model) do
    before do
      @prompt = create(:comprehension_prompt)
      @rule_set = create(:comprehension_rule_set, :prompt_ids => ([@prompt.id]))
      @regex_rule = create(:comprehension_regex_rule, :rule_set => (@rule_set))
    end
  end
end
