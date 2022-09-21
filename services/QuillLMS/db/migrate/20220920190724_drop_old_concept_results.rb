# frozen_string_literal: true

class DropOldConceptResults < ActiveRecord::Migration[6.1]
  def up
    remove_column :concept_results, :old_concept_result_id
    drop_table :old_concept_results
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
