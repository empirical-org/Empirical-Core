class AddTextToNotifications < ActiveRecord::Migration
  def change
    add_column :notifications, :text, :text, null: false, limit: 500
  end
end
