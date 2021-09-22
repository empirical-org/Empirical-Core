class AddLessonInputToScores < ActiveRecord::Migration[4.2]
  def change
    add_column :scores, :practice_lesson_input, :text
    add_column :scores, :review_lesson_input, :text
  end
end
