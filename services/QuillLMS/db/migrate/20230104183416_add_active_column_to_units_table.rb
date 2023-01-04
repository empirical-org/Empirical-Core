# frozen_string_literal: true

class AddActiveColumnToUnitsTable < ActiveRecord::Migration[6.1]
  def change
    add_column :units, :active, :boolean, null: false, default: true
  end
end
