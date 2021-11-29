# frozen_string_literal: true

class CreateFeedbackHistory < ActiveRecord::Migration[4.2]
  def change
    create_table :feedback_histories do |t|
      t.text :activity_session_uid
      t.references :prompt, polymorphic: true
      t.text :concept_uid
      t.integer :attempt, null: false
      t.text :entry, null: false
      t.boolean :optimal, null: false
      t.boolean :used, null: false
      t.text :feedback_text
      t.text :feedback_type, null: false
      t.datetime :time, null: false
      t.jsonb :metadata

      t.timestamps null: false
    end
    add_index :feedback_histories, :activity_session_uid
    add_index :feedback_histories, [:prompt_type, :prompt_id],
              name: "index_feedback_histories_on_prompt_type_and_id"
    add_index :feedback_histories, :concept_uid
  end
end
