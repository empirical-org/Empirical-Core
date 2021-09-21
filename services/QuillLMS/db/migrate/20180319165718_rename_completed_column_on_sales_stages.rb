class RenameCompletedColumnOnSalesStages < ActiveRecord::Migration[4.2]
  def change
    rename_column :sales_stages, :completed, :completed_at
  end
end
