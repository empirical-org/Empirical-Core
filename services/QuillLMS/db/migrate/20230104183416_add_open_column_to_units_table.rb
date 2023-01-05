# frozen_string_literal: true

class AddOpenColumnToUnitsTable < ActiveRecord::Migration[6.1]
  def change
    add_column :units, :open, :boolean, null: false, default: true
  end
end
