class AddTimestampsToNotifications < ActiveRecord::Migration[4.2]
  def change
    change_table :notifications do |t|
      t.timestamps
    end
  end
end
