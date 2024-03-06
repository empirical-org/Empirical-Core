# frozen_string_literal: true

require 'neighbor'

class CreateEvidencePromptResponses < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_prompt_responses do |t|
      t.integer :prompt_id, null: false
      t.text :text, null: false
      t.vector :embedding, limit: Evidence::PromptResponse::DIMENSION, null: false
    end
  end
end
