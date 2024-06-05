# frozen_string_literal: true

class RenameExampleFeedbacksToQuillFeedbacks < ActiveRecord::Migration[7.0]
  def change
    rename_table :evidence_research_gen_ai_example_feedbacks, :evidence_research_gen_ai_quill_feedbacks
  end
end
