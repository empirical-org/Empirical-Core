class RenameCompletedColumnOnSalesStages < ActiveRecord::Migration
  def change
    rename_column :sales_stages, :completed, :completed_at
  end
end
