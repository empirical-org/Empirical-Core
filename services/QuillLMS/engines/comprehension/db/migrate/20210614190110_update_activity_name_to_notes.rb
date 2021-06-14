class UpdateActivityNameToNotes < ActiveRecord::Migration
  def change
    rename_column :comprehension_activities, :name, :notes
  end
end
