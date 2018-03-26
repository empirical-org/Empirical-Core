class AddTriggerToSalesStageTypes < ActiveRecord::Migration
  def change
    add_column :sales_stage_types, :trigger, :integer
  end
end
