# frozen_string_literal: true

class ChangeClassCodeToString < ActiveRecord::Migration[4.2]
  def up
    change_column :users,       :classcode, :string
    change_column :assignments, :classcode, :string
  end

  def down
    change_column :users,       :classcode, :integer
    change_column :assignments, :classcode, :integer
  end
end
