class RenameConceptResultsTable < ActiveRecord::Migration[5.2]
  def change
    rename_table :concept_results, :old_concept_results
  end
end
