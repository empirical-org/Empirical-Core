class DropResponseParentIdIndex < ActiveRecord::Migration[6.1]
  def up
    remove_index :responses, :parent_id
  end

  def down
    original_timeout = db_timeout
    db_set_timeout(RefreshResponsesViewWorker::REFRESH_TIMEOUT)

    add_index :responses, :parent_id
  ensure
    db_set_timeout(original_timeout)
  end

  private def db_set_timeout(time_string)
    escaped_time_string = quote(time_string)

    execute("SET statement_timeout = #{escaped_time_string}")
  end

  private def db_timeout
    execute('SHOW statement_timeout').first['statement_timeout']
  end
end
