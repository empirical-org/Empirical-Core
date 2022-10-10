# frozen_string_literal: true

class DropOldConceptResults < ActiveRecord::Migration[6.1]
  def change
    remove_reference :concept_results, :old_concept_result
    drop_table :old_concept_results do |t|
      t.integer :activity_session_id
      t.integer :concept_id, null: false
      t.string :question_type
      t.json :metadata
    end
  end
end
