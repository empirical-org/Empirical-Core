class AddClasscodeToUser < ActiveRecord::Migration
  def change
    add_column :users, :classcode, :integer
  end
end
