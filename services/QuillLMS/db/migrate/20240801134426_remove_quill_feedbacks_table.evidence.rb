# frozen_string_literal: true

# This migration comes from evidence (originally 20240801134328)
class RemoveQuillFeedbacksTable < ActiveRecord::Migration[7.0]
  def change
    drop_table :evidence_research_gen_ai_quill_feedbacks
  end
end
