class DropVisibilityFromUserSubscriptions < ActiveRecord::Migration
  def change
    remove_column :user_subscriptions, :visible
  end
end
