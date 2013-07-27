class ChangeClassCodeToString < ActiveRecord::Migration
  def up
    change_column :users, :classcode, :string
  end

  def down
    change_column :users, :classcode, :integer
  end
end
