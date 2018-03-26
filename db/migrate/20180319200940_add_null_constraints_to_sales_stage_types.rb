class AddNullConstraintsToSalesStageTypes < ActiveRecord::Migration
  def change
    change_column_null(:sales_stage_types, :name, false)
    change_column_null(:sales_stage_types, :order, false)
  end
end
