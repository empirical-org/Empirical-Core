class AddVisibleColumnToUsersSubscriptions < ActiveRecord::Migration
  def change
    add_column :user_subscriptions, :visible, :boolean, null: false, default: true
  end
end
