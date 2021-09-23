class AddArchivedToClassrooms < ActiveRecord::Migration[4.2]
  def change
    add_column :classrooms, :archived, :boolean, default: true
  end
end
