# frozen_string_literal: true

class CreateEvidenceResearchGenAIExampleFeedbacks < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_example_feedbacks do |t|
      t.integer :passage_prompt_response_id, null: false
      t.text :text, null: false
      t.string :label, null: false
      t.text :paraphrase

      t.timestamps
    end
  end
end
