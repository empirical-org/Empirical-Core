# frozen_string_literal: true

# This migration comes from evidence (originally 20240918144745)
class AddOrderToLLMPromptTemplate < ActiveRecord::Migration[7.1]
  def change
    add_column :evidence_research_gen_ai_llm_prompt_templates, :order, :integer

    Evidence::Research::GenAI::LLMPromptTemplate.reset_column_information
    Evidence::Research::GenAI::LLMPromptTemplate.order(:created_at).each.with_index do |llm_prompt_template, index|
      llm_prompt_template.update_column(:order, index)
    end

    change_column_null :evidence_research_gen_ai_llm_prompt_templates, :order, false
  end

  def down
    remove_column :evidence_research_gen_ai_llm_prompt_templates, :order
  end
end
