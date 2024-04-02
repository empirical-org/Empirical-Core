# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_prompts_rules
#
#  id         :integer          not null, primary key
#  prompt_id  :integer          not null
#  rule_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

module Evidence
  RSpec.describe(PromptsRule, :type => :model) do

    context 'should relationships' do

      it { should belong_to(:prompt) }

      it { should belong_to(:rule) }
    end
  end
end
