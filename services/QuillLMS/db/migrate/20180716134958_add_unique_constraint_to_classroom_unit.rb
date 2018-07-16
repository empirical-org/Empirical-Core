class AddUniqueConstraintToClassroomUnit < ActiveRecord::Migration
  def change
    add_index :classroom_units, [:classroom_id, :unit_id], unique: true
  end
end
