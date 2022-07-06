# frozen_string_literal: true

class AddMinimumAndMaximumGradeLevelsToActivities < ActiveRecord::Migration[5.2]
  def change
    add_column :activities, :minimum_grade_level, :integer
    add_column :activities, :maximum_grade_level, :integer
  end
end
