class AddTextToNotifications < ActiveRecord::Migration[4.2]
  def change
    add_column :notifications, :text, :text, null: false, limit: 500
  end
end
