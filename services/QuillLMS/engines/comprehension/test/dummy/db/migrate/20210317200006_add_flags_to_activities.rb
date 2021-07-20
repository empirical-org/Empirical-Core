class AddFlagsToActivities < ActiveRecord::Migration[4.2]
  def change
    add_column :activities, :flags, :string, array: true, default: [], null: false
  end
end
