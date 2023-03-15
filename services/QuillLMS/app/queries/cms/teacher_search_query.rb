# frozen_string_literal: true

class Cms::TeacherSearchQuery
  def initialize(school_id)
    @school_id = school_id
  end

  def run
    RawSqlRunner.execute(
      <<-SQL
        SELECT
          users.name AS teacher_name,
          users.email,
          COUNT(DISTINCT classrooms.id) AS number_classrooms,
          COUNT(DISTINCT students_classrooms.student_id) AS number_students,
          TO_CHAR(users.last_sign_in, 'Mon DD, YYYY') AS last_active,
          subscriptions.account_type AS subscription,
          users.id AS user_id,
          schools_admins.id AS admin_id
        FROM schools_users
        LEFT JOIN users
          ON schools_users.user_id = users.id
        LEFT JOIN classrooms_teachers
          ON classrooms_teachers.user_id = users.id
          AND classrooms_teachers.role = 'owner'
        LEFT JOIN classrooms
          ON classrooms.id = classrooms_teachers.classroom_id
          AND classrooms.visible = true
        LEFT JOIN students_classrooms
          ON classrooms.id = students_classrooms.classroom_id
        LEFT JOIN user_subscriptions
          ON schools_users.user_id = user_subscriptions.user_id
        LEFT JOIN subscriptions
          ON subscriptions.id = user_subscriptions.subscription_id
        LEFT JOIN schools_admins
          ON users.id = schools_admins.user_id
        WHERE schools_users.school_id = #{ActiveRecord::Base.connection.quote(school_id)}
        GROUP BY
          users.name,
          users.last_sign_in,
          subscriptions.account_type,
          users.id,
          schools_admins.id
      SQL
    ).to_a
  end

  attr_reader :school_id
  private :school_id

  # This query return an array of hashes that look like this:
  # [
  #   {
  #     teacher_name: 'teacher name',
  #     number_classrooms: 3,
  #     number_students: 61,
  #     last_active: 'Sep 19, 2017',
  #     subscription: 'School Paid',
  #     user_id: 42,
  #     admin_id: null
  #   }
  # ]
end
