# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompts
#
#  id                          :bigint           not null, primary key
#  locked                      :boolean          not null
#  optimal_examples_count      :integer          not null
#  optimal_guidelines_count    :integer          not null
#  prompt                      :text             not null
#  suboptimal_examples_count   :integer          not null
#  suboptimal_guidelines_count :integer          not null
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  llm_prompt_template_id      :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMPrompt < ApplicationRecord
        FEEDBACK_JSON_SCHEMA = { 'optimal': 'boolean', 'feedback': 'string' }.to_json

        belongs_to :llm_prompt_template

        has_one :trial, dependent: :destroy
        has_many :llm_prompt_prompt_examples, dependent: :destroy
        has_many :prompt_examples, through: :llm_prompt_prompt_examples

        has_many :llm_prompt_guidelines, dependent: :destroy
        has_many :guidelines, through: :llm_prompt_guidelines

        validates :prompt, presence: true
        validates :llm_prompt_template_id, presence: true
        validates :optimal_guidelines_count, presence: true
        validates :suboptimal_guidelines_count, presence: true
        validates :optimal_examples_count, presence: true
        validates :suboptimal_examples_count, presence: true

        attr_readonly :prompt,
          :llm_prompt_template_id,
          :optimal_guidelines_count,
          :suboptimal_guidelines_count,
          :optimal_examples_count,
          :suboptimal_examples_count

        delegate :description, to: :llm_prompt_template

        def self.create_from_template!(dataset_id:, guideline_ids:, llm_prompt_template_id:, prompt_example_ids:)
          guidelines = Guideline.where(id: guideline_ids)
          prompt_examples = PromptExample.where(id: prompt_example_ids)

          ActiveRecord::Base.transaction do
            llm_prompt = create!(
              llm_prompt_template_id: llm_prompt_template_id,
              locked: false,
              prompt: LLMPromptBuilder.run(dataset_id:, guidelines:, llm_prompt_template_id:, prompt_examples:),
              optimal_examples_count: prompt_examples.optimal.count,
              suboptimal_examples_count: prompt_examples.suboptimal.count,
              optimal_guidelines_count: guidelines.optimal.count,
              suboptimal_guidelines_count: guidelines.suboptimal.count
            )

            LLMPromptGuideline.create!(guideline_ids.map { |id| { llm_prompt:, guideline_id: id } })
            LLMPromptPromptExample.create!(prompt_example_ids.map { |id| { llm_prompt:, prompt_example_id: id } })

            llm_prompt.update(locked: true)
            llm_prompt
          end
        end

        def prompt_with_student_response(student_response)
          "#{prompt}\n\n{student_response: #{student_response}}\nProvide feedback in the following JSON format: #{FEEDBACK_JSON_SCHEMA}"
        end
      end
    end
  end
end
