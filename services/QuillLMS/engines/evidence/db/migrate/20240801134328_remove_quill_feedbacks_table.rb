# frozen_string_literal: true

class RemoveQuillFeedbacksTable < ActiveRecord::Migration[7.0]
  def change
    drop_table :evidence_research_gen_ai_quill_feedbacks
  end
end
