class ChangeClassCodeToString < ActiveRecord::Migration
  def up
    change_column :users,       :classcode, :string
    change_column :assignments, :classcode, :string
  end

  def down
    change_column :users,       :classcode, :integer
    change_column :assignments, :classcode, :integer
  end
end
