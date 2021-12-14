# frozen_string_literal: true

class RemoveHiddenFromClassroomsAgain < ActiveRecord::Migration[4.2]
  def change
    remove_column :classrooms, :hidden
  end
end
