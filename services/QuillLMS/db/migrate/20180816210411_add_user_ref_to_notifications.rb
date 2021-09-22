class AddUserRefToNotifications < ActiveRecord::Migration[4.2]
  def change
    add_reference :notifications, :user, foreign_key: true, index: true, null: false
  end
end
