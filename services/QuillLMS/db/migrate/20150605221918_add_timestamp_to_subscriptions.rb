class AddTimestampToSubscriptions < ActiveRecord::Migration
  def change
    add_column :subscriptions, :created_at, :datetime
    add_column :subscriptions, :updated_at, :datetime
  end
end