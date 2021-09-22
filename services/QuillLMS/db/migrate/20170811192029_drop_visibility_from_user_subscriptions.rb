class DropVisibilityFromUserSubscriptions < ActiveRecord::Migration[4.2]
  def change
    remove_column :user_subscriptions, :visible
  end
end
