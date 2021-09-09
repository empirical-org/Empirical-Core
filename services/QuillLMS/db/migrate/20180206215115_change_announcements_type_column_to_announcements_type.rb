class ChangeAnnouncementsTypeColumnToAnnouncementsType < ActiveRecord::Migration[4.2]
  def change
    rename_column :announcements, :type, :announcement_type
  end
end
