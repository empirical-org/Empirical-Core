# frozen_string_literal: true

class RemoveTitleFromAssessment < ActiveRecord::Migration[4.2]
  def up
    remove_column :assessments, :title
  end

  def down
    add_column :assessments, :title, :string
  end
end
