class AddUnitActivitiesTable < ActiveRecord::Migration[4.2]
  def change
    create_table :unit_activities do |t|
      t.references :unit, index: true, foreign_key: true, null: false
      t.references :activity, index: true, foreign_key: true, null: false
      t.boolean :visible, default: true
      t.datetime :due_date

      t.timestamps
    end

    add_index :unit_activities, [:unit_id, :activity_id], unique: true
  end
end
