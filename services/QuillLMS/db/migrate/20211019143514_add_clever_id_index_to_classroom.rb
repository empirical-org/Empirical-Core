# frozen_string_literal: true

class AddCleverIdIndexToClassroom < ActiveRecord::Migration[5.1]
  def change
    add_index :classrooms, :clever_id
  end
end
