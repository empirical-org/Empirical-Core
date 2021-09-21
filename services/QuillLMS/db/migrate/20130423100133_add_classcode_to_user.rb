class AddClasscodeToUser < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :classcode, :integer
  end
end
