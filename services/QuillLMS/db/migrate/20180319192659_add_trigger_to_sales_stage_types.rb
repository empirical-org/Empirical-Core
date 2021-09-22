class AddTriggerToSalesStageTypes < ActiveRecord::Migration[4.2]
  def change
    add_column :sales_stage_types, :trigger, :integer
  end
end
