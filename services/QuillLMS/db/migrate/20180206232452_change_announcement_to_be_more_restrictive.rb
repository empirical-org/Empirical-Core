class ChangeAnnouncementToBeMoreRestrictive < ActiveRecord::Migration[4.2]
  def change
    remove_column :announcements, :html
    add_column :announcements, :link, :text
    add_column :announcements, :text, :text
  end
end
