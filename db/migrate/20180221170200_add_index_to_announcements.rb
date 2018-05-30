class AddIndexToAnnouncements < ActiveRecord::Migration
  def change
    add_index :announcements, [:start, :end], order: {start: :asc, end: :desc}
  end
end
