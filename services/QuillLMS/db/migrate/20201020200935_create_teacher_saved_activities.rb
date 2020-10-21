class CreateTeacherSavedActivities < ActiveRecord::Migration
  def change
    create_table :teacher_saved_activities do |t|
      t.integer :teacher_id, null: false
      t.references :activity, foreign_key: true, null: false

      t.timestamps null: false
    end
    add_foreign_key :teacher_saved_activities, :users, column: :teacher_id
  end
end
