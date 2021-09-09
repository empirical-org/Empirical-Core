class AddLessonTypeToLessons < ActiveRecord::Migration[4.2]
  def up
    add_column :lessons, :lesson_type, :string
    add_index :lessons, :lesson_type
# Commenting this out since there's no longer a `Lesson` model in the
# code-base, and that means that this migration can't run anymore.
# Dropping this line won't matter since a follow-on migration deletes
# this table anyway
#    Lesson.update_all(lesson_type: 'connect_lesson')
    change_column_null :lessons, :lesson_type, false
  end
  def down
    remove_column :lessons, :lesson_type
  end
end
