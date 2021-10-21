class AddCleverIdIndexToClassroom < ActiveRecord::Migration[5.1]
  def change
    add_index :classrooms, :clever_id
  end
end
