# frozen_string_literal: true

class DropOldActivitySessionsTable < ActiveRecord::Migration[4.2]
  def up
    return unless ActiveRecord::Base.connection.tables.include?('old_activity_sessions')

    execute 'ALTER SEQUENCE activity_sessions_id_seq OWNED BY activity_sessions.id'
    execute 'DROP TABLE old_activity_sessions'
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end