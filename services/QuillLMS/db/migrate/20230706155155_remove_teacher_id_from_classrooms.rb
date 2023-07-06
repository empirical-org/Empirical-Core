# frozen_string_literal: true

class RemoveTeacherIdFromClassrooms < ActiveRecord::Migration[6.1]
  def change
    remove_column :classrooms, :teacher_id, :integer
  end
end
