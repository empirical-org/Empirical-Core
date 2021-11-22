# frozen_string_literal: true

class AddStoryInputToStories < ActiveRecord::Migration[4.2]
  def change
    add_column    :scores, :story_step_input, :text
    rename_column :scores, :practice_lesson_input, :practice_step_input
    rename_column :scores, :review_lesson_input, :review_step_input
  end
end
