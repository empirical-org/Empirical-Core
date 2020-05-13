class DropActivitySessionLogs < ActiveRecord::Migration
  def up
    connection.execute(
      <<~SQL.squish
        DROP FUNCTION timespent_activity_session;
      SQL
    )

    drop_table :activity_session_interaction_logs
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
