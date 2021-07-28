class UpdateActivityNameToNotes < ActiveRecord::Migration[4.2]
  def change
    rename_column :comprehension_activities, :name, :notes
  end
end
