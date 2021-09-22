class RemoveFlagFromUser < ActiveRecord::Migration[4.2]
  def change
    remove_column :users, :flag, :string
  end
end
