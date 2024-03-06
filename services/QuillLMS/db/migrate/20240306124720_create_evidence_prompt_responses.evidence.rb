# frozen_string_literal: true

# This migration comes from evidence (originally 20240305224710)
require 'neighbor'

class CreateEvidencePromptResponses < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_prompt_responses do |t|
      t.text :text, null: false
      t.vector :embedding, limit: Evidence::PromptResponse::DIMENSION, null: false
    end

    add_index :evidence_prompt_responses, :text, unique: true
  end
end
