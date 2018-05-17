class AddTimestampToUnits < ActiveRecord::Migration
  def change
    add_column :units, :created_at, :datetime
    add_column :units, :updated_at, :datetime
  end
end
