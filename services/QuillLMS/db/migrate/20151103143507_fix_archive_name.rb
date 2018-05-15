class FixArchiveName < ActiveRecord::Migration
  def change
    rename_column :classrooms, :archived, :hidden
  end
end
