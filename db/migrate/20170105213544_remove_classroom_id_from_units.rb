class RemoveClassroomIdFromUnits < ActiveRecord::Migration
  def change
    remove_column :units, :classroom_id, :integer
  end
end
