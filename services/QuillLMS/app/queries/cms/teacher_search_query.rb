class Cms::TeacherSearchQuery
  def initialize(school_id)
    @school_id = school_id
  end

  def run
    ActiveRecord::Base.connection.execute("
      SELECT
        users.name AS teacher_name,
        COUNT(DISTINCT classrooms.id) AS number_classrooms,
        COUNT(DISTINCT students_classrooms.student_id) AS number_students,
        COUNT(DISTINCT activity_sessions) AS number_activities_completed,
        TO_CHAR(GREATEST(users.last_sign_in, MAX(activity_sessions.completed_at)), 'Mon DD, YYYY') AS last_active,
        subscriptions.account_type AS subscription,
        users.id AS user_id,
        schools_admins.id AS admin_id
      FROM schools_users
      LEFT JOIN users ON schools_users.user_id = users.id
      LEFT JOIN classrooms_teachers ON classrooms_teachers.user_id = users.id AND classrooms_teachers.role = 'owner'
      LEFT JOIN classrooms ON classrooms.id = classrooms_teachers.classroom_id AND classrooms.visible = true
      LEFT JOIN students_classrooms ON classrooms.id =  students_classrooms.classroom_id
      LEFT JOIN activity_sessions ON students_classrooms.student_id = activity_sessions.user_id AND completed_at IS NOT NULL
      LEFT JOIN user_subscriptions ON schools_users.user_id = user_subscriptions.user_id
      LEFT JOIN subscriptions ON subscriptions.id = user_subscriptions.subscription_id
      LEFT JOIN schools_admins ON users.id = schools_admins.user_id
      WHERE schools_users.school_id = #{ActiveRecord::Base.sanitize(school_id)}
      GROUP BY users.name, users.last_sign_in, subscriptions.account_type, users.id, schools_admins.id
    ").to_a
  end

  attr_reader :school_id
  private :school_id

  # This query return an array of hashes that look like this:
  # [
  #   {
  #     teacher_name: 'teacher name',
  #     number_classrooms: 3,
  #     number_students: 61,
  #     number_activities_completed: 212,
  #     last_active: 'Sep 19, 2017',
  #     subscription: 'School Paid',
  #     user_id: 42,
  #     admin_id: null
  #   }
  # ]
end