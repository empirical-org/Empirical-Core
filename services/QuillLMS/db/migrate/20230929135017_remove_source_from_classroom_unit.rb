# frozen_string_literal: true

class RemoveSourceFromClassroomUnit < ActiveRecord::Migration[7.0]
  def change
    remove_column :classroom_units, :source_classroom_unit_id, :integer
  end
end
