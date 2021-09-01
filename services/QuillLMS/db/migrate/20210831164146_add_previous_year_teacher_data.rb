class AddPreviousYearTeacherData < ActiveRecord::Migration[5.1]
  def change
    create_table :previous_year_teacher_data do |t|
      t.references :user, index: true, foreign_key: true, null: false
      t.integer :year, null: false
      t.jsonb :data

      t.timestamps null: false
    end
  end
end
