class AddTimespentToActivitySession < ActiveRecord::Migration
  def change
    add_column :activity_sessions, :timespent, :integer
  end
end
