class AddLessonTypeToLessons < ActiveRecord::Migration
  def up
    add_column :lessons, :lesson_type, :string
    add_index :lessons, :lesson_type
    Lesson.update_all(lesson_type: 'connect_lesson')
    change_column_null :lessons, :lesson_type, false
  end
  def down
    remove_column :lessons, :lesson_type
  end
end
