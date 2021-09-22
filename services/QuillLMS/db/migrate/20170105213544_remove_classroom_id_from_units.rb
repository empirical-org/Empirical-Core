class RemoveClassroomIdFromUnits < ActiveRecord::Migration[4.2]
  def change
    remove_column :units, :classroom_id, :integer
  end
end
