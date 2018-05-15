class RemoveZoneFromAnnouncementsTimes < ActiveRecord::Migration
  def change
    change_column :announcements, :start, 'timestamp without time zone'
    change_column :announcements, :end, 'timestamp without time zone'
  end
end
