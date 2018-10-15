class Types::UserType < Types::BaseObject
  graphql_name 'User'

  field :id, ID, null: false
  field :name, String, null: false
  field :email, String, null: true
  field :username, String, null: true
  field :role, String, null: false
  field :time_zone, String, null: true

  field :notifications, [Types::NotificationType], null: true

  field :activity_scores, [Types::ActivityScoreType], null: true

  def notifications
    object.notifications.order("created_at DESC").limit(10)
  end

  def activity_scores 
    scores = ActivitySession.find_by_sql("
      SELECT 
        activity_sessions.activity_id as activity_id,
        MAX(activity_sessions.percentage) as percentage,
        MAX(activity_sessions.updated_at) AS updated_at,
        SUM(CASE WHEN activity_sessions.state = 'started' THEN 1 ELSE 0 END) AS resume_link
      FROM activity_sessions
      
      WHERE activity_sessions.user_id = #{object.id}
      GROUP BY activity_sessions.activity_id
    ")
  end

end