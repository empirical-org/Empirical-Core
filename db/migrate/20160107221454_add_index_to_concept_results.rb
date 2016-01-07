class AddIndexToConceptResults < ActiveRecord::Migration
  def change
    add_index :concept_results, :activity_session_id
  end
end
