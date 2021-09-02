class AddVitallyTeacherRecord < ActiveRecord::Migration[5.1]
  def change
    create_table :vitally_teacher_records do |t|
      t.references :user, index: true, foreign_key: true, null: false
      t.integer :year, null: false
      t.jsonb :data

      t.timestamps null: false
    end
  end
end
