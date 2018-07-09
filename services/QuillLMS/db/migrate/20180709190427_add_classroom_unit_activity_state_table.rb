class AddClassroomUnitActivityStateTable < ActiveRecord::Migration
  def change
    create_table :classroom_unit_activity_state do |t|
      t.references :classroom_unit, index: true, foreign_key: true, null: false
      t.references :unit_activity, index: true, foreign_key: true, null: false
      t.boolean :completed, default: false
      t.boolean :pinned, default: false
      t.boolean :locked, default: false
      t.json :data, default: '{}'

      t.timestamps
    end

    add_index :classroom_unit_activity_state, [:classroom_unit_id, :unit_activity_id], unique: true, name: 'unique_classroom_and_activity_for_cua_state'
  end
end
