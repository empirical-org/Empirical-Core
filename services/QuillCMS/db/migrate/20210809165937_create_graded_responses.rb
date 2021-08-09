class CreateGradedResponses < ActiveRecord::Migration[6.1]
  def up
    original_timeout = db_timeout
    set_db_timeout(RefreshGradedResponsesWorker::REFRESH_TIMEOUT)

    create_view :graded_responses, materialized: true

    add_index :graded_responses, :id, unique: true
    add_index :graded_responses, :question_uid
    add_index :graded_responses, :optimal

  ensure
    set_db_timeout(original_timeout)
  end

  def down
    drop_view :graded_responses, materialized: true
  end

  private def set_db_timeout(time_string)
    escaped_time_string = quote(time_string)

    execute("SET statement_timeout = #{escaped_time_string}")
  end

  private def db_timeout
    execute('SHOW statement_timeout').first['statement_timeout']
  end
end
