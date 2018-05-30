class AddArchivedToClassrooms < ActiveRecord::Migration
  def change
    add_column :classrooms, :archived, :boolean, default: true
  end
end
