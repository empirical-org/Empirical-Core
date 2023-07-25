# frozen_string_literal: true

class AddSourceToClassroomUnit < ActiveRecord::Migration[6.1]
  def change
    add_column :classroom_units, :source_classroom_unit_id, :integer
  end
end
