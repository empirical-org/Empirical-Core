# frozen_string_literal: true

class AddClassroomIdToAssignments < ActiveRecord::Migration[4.2]
  def change
    add_column :assignments, :classroom_id, :integer
    remove_column :assignments, :user_id, :integer
    rename_table :assignments, :classroom_chapters
    rename_column :scores, :assignment_id, :classroom_chapter_id
  end
end
