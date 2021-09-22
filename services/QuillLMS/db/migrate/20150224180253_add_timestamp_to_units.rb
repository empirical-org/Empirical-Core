class AddTimestampToUnits < ActiveRecord::Migration[4.2]
  def change
    add_column :units, :created_at, :datetime
    add_column :units, :updated_at, :datetime
  end
end
