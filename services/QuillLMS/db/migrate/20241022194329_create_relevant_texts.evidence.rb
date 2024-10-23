# frozen_string_literal: true

# This migration comes from evidence (originally 20241022191325)
class CreateRelevantTexts < ActiveRecord::Migration[7.1]
  def change
    create_table :evidence_research_gen_ai_relevant_texts do |t|
      t.text :text, null: false
      t.text :notes, default: ''
      t.timestamps
    end
  end
end
