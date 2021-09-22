class AddIndexToAnnouncements < ActiveRecord::Migration[4.2]
  def change
    add_index :announcements, [:start, :end], order: {start: :asc, end: :desc}
  end
end
