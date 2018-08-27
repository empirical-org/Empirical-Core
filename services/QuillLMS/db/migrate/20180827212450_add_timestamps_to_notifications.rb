class AddTimestampsToNotifications < ActiveRecord::Migration
  def change
    change_table :notifications do |t|
      t.timestamps
    end
  end
end
