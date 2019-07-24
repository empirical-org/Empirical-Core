class ChangesToActivitySession < ActiveRecord::Migration
  def change

    change_column :activity_sessions, :temporary, :boolean, default: 'f'
    add_column    :activity_sessions, :started_at, :timestamp

    add_index :activity_sessions, :started_at
    add_index :activity_sessions, :completed_at

  end
end
