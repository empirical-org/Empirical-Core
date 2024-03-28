# frozen_string_literal: true

# This migration comes from evidence (originally 20240328185342)
class AddCodaToEvidenceResearchGenAILLMPromptTemplates < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_llm_prompt_templates,
      :coda,
      :string,
      null: false,
      default: Evidence::Research::GenAI::LLMPromptTemplate::FEEDBACK_CODA
  end
end
