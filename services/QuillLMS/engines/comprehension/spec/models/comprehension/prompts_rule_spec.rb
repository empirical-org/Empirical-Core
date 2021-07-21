require("rails_helper")
module Comprehension
  RSpec.describe(PromptsRule, :type => :model) do
    context("relationships") do
      it { should belong_to(:prompt) }
      it { should belong_to(:rule) }
    end
  end
end
