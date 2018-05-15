class AddNullConstraintsToSalesStages < ActiveRecord::Migration
  def change
    change_column_null(:sales_stages, :sales_stage_type_id, false)
    change_column_null(:sales_stages, :sales_contact_id, false)
  end
end
