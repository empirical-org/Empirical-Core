class AddTimespentToActivitySession < ActiveRecord::Migration[4.2]
  def change
    add_column :activity_sessions, :timespent, :integer
  end
end
