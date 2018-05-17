class CreateAnnouncements < ActiveRecord::Migration
  def change
    create_table :announcements do |t|
      t.string :type
      t.text :html
      t.datetime :start
      t.datetime :end
    end
  end
end
