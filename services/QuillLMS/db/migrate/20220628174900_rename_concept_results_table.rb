class RenameConceptResultsTable < ActiveRecord::Migration[5.2]
  def change
    rename_table :concept_results, :concept_results_old
  end
end
