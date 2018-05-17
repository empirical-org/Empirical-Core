class AddLessonInputToScores < ActiveRecord::Migration
  def change
    add_column :scores, :practice_lesson_input, :text
    add_column :scores, :review_lesson_input, :text
  end
end
