class AddLessonTypeToLessons < ActiveRecord::Migration[4.2]
  def up
    add_column :lessons, :lesson_type, :string
    add_index :lessons, :lesson_type
    # The Lesson model no longer exists, so we need to modify
    # the migration to avoid this call for modern versions of the code
    Lesson.update_all(lesson_type: 'connect_lesson') if defined?(Lesson)
    change_column_null :lessons, :lesson_type, false
  end
  def down
    remove_column :lessons, :lesson_type
  end
end
