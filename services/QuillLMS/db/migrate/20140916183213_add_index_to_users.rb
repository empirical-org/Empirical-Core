class AddIndexToUsers < ActiveRecord::Migration[4.2]
  def change
    add_index :users, :classcode
  end
end
