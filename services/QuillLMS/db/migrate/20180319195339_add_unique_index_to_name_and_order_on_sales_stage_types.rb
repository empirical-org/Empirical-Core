class AddUniqueIndexToNameAndOrderOnSalesStageTypes < ActiveRecord::Migration[4.2]
  def change
    add_index :sales_stage_types, [:name, :order], unique: true
  end
end
