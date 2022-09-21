class DropOldConceptResults < ActiveRecord::Migration[6.1]
  def up
    drop_table :old_concept_results
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
