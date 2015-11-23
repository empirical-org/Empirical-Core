class AddVisibleColumnToUnits < ActiveRecord::Migration
  def change
    add_column :units, :visible, :boolean, null: false, default: true
  end
end
