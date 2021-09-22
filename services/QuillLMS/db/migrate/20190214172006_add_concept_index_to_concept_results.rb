class AddConceptIndexToConceptResults < ActiveRecord::Migration[4.2]
  disable_ddl_transaction!
  def up
    add_index :concept_results, :concept_id, algorithm: :concurrently unless index_exists?(:concept_results, :concept_id)
  end

  def down
    remove_index :concept_results, :concept_id
  end
end
