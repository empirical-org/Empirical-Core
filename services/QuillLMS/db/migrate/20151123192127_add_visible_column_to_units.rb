class AddVisibleColumnToUnits < ActiveRecord::Migration[4.2]
  def change
    add_column :units, :visible, :boolean, null: false, default: true
  end
end
