class ChangeNotificationsMetaDefault < ActiveRecord::Migration[4.2]
  def up
    change_column_default :notifications, :meta, {}
  end

  def down
    change_column_default :notifications, :meta, '{}'
  end
end
