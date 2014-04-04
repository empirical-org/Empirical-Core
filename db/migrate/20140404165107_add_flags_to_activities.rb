class AddFlagsToActivities < ActiveRecord::Migration
  def change
    add_column :activities, :flags, :string, array: true
    add_column :rules, :flags, :string, array: true
  end
end
