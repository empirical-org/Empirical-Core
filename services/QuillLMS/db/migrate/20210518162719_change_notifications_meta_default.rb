class ChangeNotificationsMetaDefault < ActiveRecord::Migration
  def up
    change_column_default :notifications, :meta, {}
  end

  def down
    change_column_default :notifications, :meta, '{}'
  end
end
