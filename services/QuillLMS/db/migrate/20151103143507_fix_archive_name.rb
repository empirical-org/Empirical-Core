class FixArchiveName < ActiveRecord::Migration[4.2]
  def change
    rename_column :classrooms, :archived, :hidden
  end
end
