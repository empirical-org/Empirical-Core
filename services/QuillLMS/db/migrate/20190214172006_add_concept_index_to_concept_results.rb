class AddConceptIndexToConceptResults < ActiveRecord::Migration
  disable_ddl_transaction!
  def up
    add_index :concept_results, :concept_id, algorithm: :concurrently unless index_exists?(:concept_results, :concept_id)
  end

  def down
    remove_index :concept_results, :concept_id
  end
end
