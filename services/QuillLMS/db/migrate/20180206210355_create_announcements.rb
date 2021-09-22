class CreateAnnouncements < ActiveRecord::Migration[4.2]
  def change
    create_table :announcements do |t|
      t.string :type
      t.text :html
      t.datetime :start
      t.datetime :end
    end
  end
end
