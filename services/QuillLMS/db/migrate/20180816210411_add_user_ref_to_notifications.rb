class AddUserRefToNotifications < ActiveRecord::Migration
  def change
    add_reference :notifications, :user, foreign_key: true, index: true, null: false
  end
end
