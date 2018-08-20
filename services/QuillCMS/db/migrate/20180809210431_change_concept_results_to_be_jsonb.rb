class ChangeConceptResultsToBeJsonb < ActiveRecord::Migration[5.1]
  def change
    change_column :responses, :concept_results, :jsonb
  end
end
