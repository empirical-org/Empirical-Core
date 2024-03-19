# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_experiments
#
#  id                :bigint           not null, primary key
#  results           :jsonb
#  status            :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  llm_config_id     :integer          not null
#  llm_prompt_id     :integer          not null
#  passage_prompt_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Experiment, type: :model do
        it { belong_to(:llm_config).class_name('Evidence::Research::GenAI::LLMConfig') }
        it { belong_to(:llm_prompt).class_name('Evidence::Research::GenAI::LLMPrompt') }
        it { belong_to(:passage_prompt).class_name('Evidence::Research::GenAI::PassagePrompt') }

        it { should validate_presence_of(:status) }

        it { expect(build(:evidence_research_gen_ai_experiment)).to be_valid }
      end
    end
  end
end
