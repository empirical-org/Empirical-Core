# frozen_string_literal: true

class AddInstructorModeToActivityClassification < ActiveRecord::Migration[4.2]
  def change
    add_column :activity_classifications, :instructor_mode, :boolean, default: false
  end
end
