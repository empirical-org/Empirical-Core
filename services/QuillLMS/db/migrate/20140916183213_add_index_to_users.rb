class AddIndexToUsers < ActiveRecord::Migration
  def change
    add_index :users, :classcode
  end
end
