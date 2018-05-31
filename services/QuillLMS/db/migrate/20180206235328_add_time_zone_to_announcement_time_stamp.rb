class AddTimeZoneToAnnouncementTimeStamp < ActiveRecord::Migration
  def change
    change_column :announcements, :start, 'timestamp with time zone'
    change_column :announcements, :end, 'timestamp with time zone'
  end
end
