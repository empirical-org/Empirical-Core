# frozen_string_literal: true

# This migration comes from evidence (originally 20240307142932)
class CreateEvidencePromptResponseFeedbacks < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_prompt_response_feedbacks do |t|
      t.integer :prompt_response_id, null: false
      t.text :feedback, null: false
      t.jsonb :metadata

      t.timestamps
    end
  end
end
