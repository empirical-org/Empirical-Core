# frozen_string_literal: true

class AddIndexToDistricts < ActiveRecord::Migration[5.1]
  def change
    add_index :districts, :name
  end
end
