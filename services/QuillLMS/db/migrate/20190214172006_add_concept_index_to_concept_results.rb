class AddConceptIndexToConceptResults < ActiveRecord::Migration
  self.disable_ddl_transaction!
  def change
    add_index :concept_results, :concept_id, algorithm: :concurrently
  end
end
