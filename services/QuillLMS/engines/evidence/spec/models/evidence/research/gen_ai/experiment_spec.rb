# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_experiments
#
#  id                :bigint           not null, primary key
#  experiment_errors :text             is an Array
#  results           :jsonb
#  status            :string           default("pending"), not null
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
        it { should validate_presence_of(:status) }
        it { should validate_presence_of(:llm_config_id) }
        it { should validate_presence_of(:llm_prompt_id) }
        it { should validate_presence_of(:passage_prompt_id) }
        it { should validate_inclusion_of(:status).in_array(described_class::STATUSES) }
        it { should have_readonly_attribute(:llm_config_id) }
        it { should have_readonly_attribute(:llm_prompt_id) }
        it { should have_readonly_attribute(:passage_prompt_id) }

        it { belong_to(:llm_config).class_name('Evidence::Research::GenAI::LLMConfig') }
        it { belong_to(:llm_prompt).class_name('Evidence::Research::GenAI::LLMPrompt') }
        it { belong_to(:passage_prompt).class_name('Evidence::Research::GenAI::PassagePrompt') }

        it do
          have_many(:passage_prompt_responses)
            .class_name('Evidence::Research::GenAI::PassagePromptResponse')
            .through(:passage_prompt)
        end

        it do
          have_many(:llm_feedbacks)
            .class_name('Evidence::Research::GenAI::LLMPromptFeedback')
            .through(:passage_prompt_responses)
        end

        it do
          have_many(:example_feedbacks)
            .class_name('Evidence::Research::GenAI::ExampleFeedback')
            .through(:passage_prompt_responses)
        end

        it { expect(build(:evidence_research_gen_ai_experiment)).to be_valid }
      end
    end
  end
end
