class AddIndexToConceptResults < ActiveRecord::Migration[4.2]
  def change
    add_index :concept_results, :activity_session_id
  end
end
