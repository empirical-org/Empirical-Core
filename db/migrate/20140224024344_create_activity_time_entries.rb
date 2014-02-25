class CreateActivityTimeEntries < ActiveRecord::Migration
  def change
    create_table :activity_time_entries do |t|
      t.belongs_to :activity_session, index: true
      t.timestamp :started_at
      t.timestamp :ended_at

      t.timestamps
    end
  end
end
