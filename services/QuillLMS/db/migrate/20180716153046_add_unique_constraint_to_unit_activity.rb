class AddUniqueConstraintToUnitActivity < ActiveRecord::Migration
  def change
    add_index :unit_activities, [:activity_id, :unit_id], unique: true
  end
end
