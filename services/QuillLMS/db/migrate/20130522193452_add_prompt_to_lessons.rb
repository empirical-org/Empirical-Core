# frozen_string_literal: true

class AddPromptToLessons < ActiveRecord::Migration[4.2]
  def up
    add_column :lessons, :prompt, :text
  end

  def down
    remove_column :lessons, :prompt
  end
end
