class RemoveSubscriptionFromUsers < ActiveRecord::Migration[4.2]
  def change
    remove_column :users, :subscription
  end
end
