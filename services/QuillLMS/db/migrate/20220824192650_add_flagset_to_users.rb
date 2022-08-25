class AddFlagsetToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :flagset, :string, null: false, default: 'production'
  end
end
