# frozen_string_literal: true

class AddUniquenessToExternalIdInLearnWorldsCourse < ActiveRecord::Migration[6.1]
  def change
    add_index :learn_worlds_courses, :external_id, unique: true
  end
end
