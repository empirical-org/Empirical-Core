class AddGoogleIdToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :google_id, :string
    add_index :users, :google_id
  end
end
