namespace :migrate_backfill_user_activity_classifications do
  desc 'Establish initial values for UserActivityClassification counts'
  task :run => :environment do
    User.select(<<-SELECT
        users.id AS user_id,
        activity_classifications.id AS activity_classification_id,
        COUNT(*) AS count
      SELECT
    )
      .joins('activity_sessions ON users.id = activity_sessions.user_id')
      .joins('activities ON activity_sessions.activity_id = activities.id')
      .joins('join activity_classifications ON activities.activity_classification_id = activity_classifications.id')
      .group('users.id, activity_classifications.id')
      .each do |data|
        UserActivityClassification.create(user_id: data.user_id, activity_classification_id: data.activity_classification_id, count: data.count)
      end
  end
end
