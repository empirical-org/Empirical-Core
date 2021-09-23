class AddTimeZoneToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :time_zone, :string
    add_index :users, :time_zone
  end
end
