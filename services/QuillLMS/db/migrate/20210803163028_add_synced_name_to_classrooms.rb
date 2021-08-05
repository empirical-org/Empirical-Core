class AddSyncedNameToClassrooms < ActiveRecord::Migration[5.1]
  def change
    add_column :classrooms, :synced_name, :string
  end
end
