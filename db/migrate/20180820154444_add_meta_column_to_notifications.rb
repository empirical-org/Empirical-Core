class AddMetaColumnToNotifications < ActiveRecord::Migration
  def change
    add_column :notifications, :meta, :jsonb, null: false, default: '{}'
  end
end
