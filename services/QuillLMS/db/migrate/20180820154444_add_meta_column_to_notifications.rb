class AddMetaColumnToNotifications < ActiveRecord::Migration[4.2]
  def change
    add_column :notifications, :meta, :jsonb, null: false, default: '{}'
  end
end
