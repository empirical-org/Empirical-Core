class ChangeAnnouncementToBeMoreRestrictive < ActiveRecord::Migration
  def change
    remove_column :announcements, :html
    add_column :announcements, :link, :text
    add_column :announcements, :text, :text
  end
end
