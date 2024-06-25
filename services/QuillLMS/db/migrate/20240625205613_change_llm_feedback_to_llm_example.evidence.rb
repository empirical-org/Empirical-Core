# frozen_string_literal: true

# This migration comes from evidence (originally 20240625204226)
class ChangeLLMFeedbackToLLMExample < ActiveRecord::Migration[7.0]
  def change
    rename_table :evidence_research_gen_ai_llm_feedbacks, :evidence_research_gen_ai_llm_examples
    rename_column :evidence_research_gen_ai_llm_examples, :student_response_id, :test_example_id
    rename_column :evidence_research_gen_ai_llm_examples, :text, :llm_feedback
    add_column :evidence_research_gen_ai_llm_examples, :llm_assigned_status, :string

    Evidence::Research::GenAI::LLMExample.reset_column_information
    Evidence::Research::GenAI::LLMExample.find_each do |llm_example|
      llm_example.update!(llm_assigned_status: Evidence::Research::GenAI::HasAssignedStatus::SUBOPTIMAL)
    end

    change_column_null :evidence_research_gen_ai_llm_examples, :llm_assigned_status, false
  end
end
