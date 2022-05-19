# frozen_string_literal: true

class AddConstraintsToDistricts < ActiveRecord::Migration[5.1]
  def change
    add_index :districts, :nces_id, unique: true
    change_column_null :districts, :name, false
  end
end
