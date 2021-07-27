namespace :migrate_backfill_user_activity_classifications do
  desc 'Establish initial values for UserActivityClassification counts'
  task :run => :environment do
    records = User.select(<<-SELECT
        users.id AS user_id,
        activity_classifications.id AS activity_classification_id,
        COUNT(*) AS count
      SELECT
    )
      .joins('JOIN activity_sessions ON users.id = activity_sessions.user_id')
      .joins('JOIN activities ON activity_sessions.activity_id = activities.id')
      .joins('JOIN activity_classifications ON activities.activity_classification_id = activity_classifications.id')
      .where("activity_sessions.state = 'finished'")
      .group('users.id, activity_classifications.id')
    records.each do |data|
      UserActivityClassification.create(user_id: data.user_id, activity_classification_id: data.activity_classification_id, count: data.count)
    end
  end
end
