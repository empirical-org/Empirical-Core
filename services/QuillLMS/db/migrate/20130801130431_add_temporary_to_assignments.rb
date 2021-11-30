# frozen_string_literal: true

class AddTemporaryToAssignments < ActiveRecord::Migration[4.2]
  def change
    add_column :assignments, :temporary, :boolean, null: false, default: false
  end
end
