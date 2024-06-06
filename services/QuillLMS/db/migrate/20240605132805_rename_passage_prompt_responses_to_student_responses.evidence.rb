# frozen_string_literal: true

# This migration comes from evidence (originally 20240605132531)
class RenamePassagePromptResponsesToStudentResponses < ActiveRecord::Migration[7.0]
  def change
    rename_column :evidence_research_gen_ai_passage_prompt_responses, :response, :text
    rename_table :evidence_research_gen_ai_passage_prompt_responses, :evidence_research_gen_ai_student_responses
    rename_column :evidence_research_gen_ai_quill_feedbacks, :passage_prompt_response_id, :student_response_id
    rename_column :evidence_research_gen_ai_llm_feedbacks, :passage_prompt_response_id, :student_response_id
  end
end
