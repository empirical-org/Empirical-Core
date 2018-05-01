class RemoveFlagFromUser < ActiveRecord::Migration
  def change
    remove_column :users, :flag, :string
  end
end
