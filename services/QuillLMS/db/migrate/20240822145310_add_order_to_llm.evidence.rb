# frozen_string_literal: true

# This migration comes from evidence (originally 20240822145206)
class AddOrderToLLM < ActiveRecord::Migration[7.0]
  def up
    add_column :evidence_research_gen_ai_llms, :order, :integer

    Evidence::Research::GenAI::LLM.reset_column_information
    Evidence::Research::GenAI::LLM.order(:created_at).each.with_index do |llm, index|
      llm.update_column(:order, index)
    end

    change_column_null :evidence_research_gen_ai_llms, :order, false
  end

  def down
    remove_column :evidence_research_gen_ai_llms, :order
  end
end
