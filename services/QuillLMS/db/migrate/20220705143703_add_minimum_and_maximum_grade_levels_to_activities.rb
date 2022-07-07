# frozen_string_literal: true

class AddMinimumAndMaximumGradeLevelsToActivities < ActiveRecord::Migration[5.2]
  def change
    add_column :activities, :minimum_grade_level, :smallint
    add_column :activities, :maximum_grade_level, :smallint
  end
end
