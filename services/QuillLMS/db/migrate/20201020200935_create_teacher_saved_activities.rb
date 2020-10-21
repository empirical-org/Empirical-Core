class CreateTeacherSavedActivities < ActiveRecord::Migration
  def change
    create_table :teacher_saved_activities do |t|
      t.references :teacher, foreign_key: true, references: :users, null: false
      t.references :activity, foreign_key: true, null: false

      t.timestamps null: false
    end
  end
end
