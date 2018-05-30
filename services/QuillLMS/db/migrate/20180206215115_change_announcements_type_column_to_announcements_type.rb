class ChangeAnnouncementsTypeColumnToAnnouncementsType < ActiveRecord::Migration
  def change
    rename_column :announcements, :type, :announcement_type
  end
end
