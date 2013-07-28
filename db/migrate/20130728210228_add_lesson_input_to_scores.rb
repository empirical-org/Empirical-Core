class AddLessonInputToScores < ActiveRecord::Migration
  def change
    add_column :scores, :lesson_input, :text
  end
end
