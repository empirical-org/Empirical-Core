class AddTimestampToSubscriptions < ActiveRecord::Migration[4.2]
  def change
    add_column :subscriptions, :created_at, :datetime
    add_column :subscriptions, :updated_at, :datetime
  end
end