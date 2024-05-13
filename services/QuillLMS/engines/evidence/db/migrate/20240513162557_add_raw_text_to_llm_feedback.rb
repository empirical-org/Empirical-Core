# frozen_string_literal: true

class AddRawTextToLLMFeedback < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_llm_feedbacks, :raw_text, :text

    Evidence::Research::GenAI::LLMFeedback.reset_column_information

    Evidence::Research::GenAI::LLMFeedback.find_each(batch_size: 1000) do |feedback|
      feedback.update_column(:raw_text, feedback.text)
    end

    change_column_null :evidence_research_gen_ai_llm_feedbacks, :raw_text, false
  end

  def down
    remove_column :evidence_research_gen_ai_llm_feedbacks, :raw_text
  end
end
