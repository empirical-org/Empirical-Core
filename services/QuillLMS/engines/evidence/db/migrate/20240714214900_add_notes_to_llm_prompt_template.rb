# frozen_string_literal: true

class AddNotesToLLMPromptTemplate < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_llm_prompt_templates, :notes, :text
    rename_column :evidence_research_gen_ai_llm_prompt_templates, :description, :name
  end
end
