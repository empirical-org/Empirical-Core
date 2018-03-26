class AddUniqueIndexToNameAndOrderOnSalesStageTypes < ActiveRecord::Migration
  def change
    add_index :sales_stage_types, [:name, :order], unique: true
  end
end
