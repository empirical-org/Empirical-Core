class AddSerialPrimaryKeyIdColumnToActivitySessionInterationLogs < ActiveRecord::Migration
  def change
  end
  def up
    connection.execute(%q{
      ALTER TABLE activity_session_interaction_logs ADD COLUMN IF NOT EXISTS id SERIAL PRIMARY KEY;
    })
  end

  def down
    connection.execute(%q{
      ALTER TABLE activity_session_interaction_logs DROP COLUMN id SERIAL PRIMARY KEY;
    })
  end
end
