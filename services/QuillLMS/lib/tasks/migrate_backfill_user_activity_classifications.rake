# frozen_string_literal: true

namespace :migrate_backfill_user_activity_classifications do
  desc 'Establish initial values for UserActivityClassification counts'
  task :run => :environment do
    # Running this as a raw SQL command in order to avoid spending any
    # CPU or RAM on interpreting the data across the ORM which could
    # get very expensive and time-consuming, especially iterating over
    # a bunch of records.
    sql = <<-SQL
      INSERT INTO user_activity_classifications (user_id, activity_classification_id, count)
      SELECT users.id, activity_classifications.id, COUNT(*)
      FROM users
        JOIN activity_sessions
          ON users.id = activity_sessions.user_id
        JOIN activities
          ON activity_sessions.activity_id = activities.id
        JOIN activity_classifications
          ON activities.activity_classification_id = activity_classifications.id
      WHERE activity_sessions.state = 'finished'
      GROUP BY users.id, activity_classifications.id
    SQL
    ActiveRecord::Base.connection.execute(sql)
  end
end
