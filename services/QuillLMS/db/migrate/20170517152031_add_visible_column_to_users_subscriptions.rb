class AddVisibleColumnToUsersSubscriptions < ActiveRecord::Migration[4.2]
  def change
    add_column :user_subscriptions, :visible, :boolean, null: false, default: true
  end
end
