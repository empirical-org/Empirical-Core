# frozen_string_literal: true

class AddConceptResultActivitySessionIndex < ActiveRecord::Migration[6.0]
  def change
    add_index :concept_results, :activity_session_id
  end
end
