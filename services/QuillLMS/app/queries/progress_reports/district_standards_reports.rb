# frozen_string_literal: true

class ProgressReports::DistrictStandardsReports
  attr_reader :admin_id

  def initialize(admin_id)
    @admin_id = admin_id
  end

  def results(admin_id)
    # Uncomment the line below, and comment out the sql query, to bypass
    # The database while testing
    # [{"id"=>"1", "name"=>"class 1b", "standard_level_name"=>"how to tell cactus from cow", "total_activity_count"=>"2", "total_student_count"=>"33", "proficient_count"=>"15"}]
    user_ids = user_ids_query(admin_id)
    return [] if user_ids.empty?

    Standard
      .all
      .pluck(:id)
      .map { |standard_id| standards_report_query(user_ids, standard_id) }
      .flatten
      .sort_by { |k| k["name"] }
  end

  def standards_report_query(user_ids, standard_id)
    RawSqlRunner.execute(
      <<~SQL
        WITH final_activity_sessions AS (
          SELECT
            activity_sessions.activity_id,
            activity_sessions.id,
            activity_sessions.percentage,
            activity_sessions.timespent,
            activity_sessions.user_id,
            activities.standard_id
          FROM activity_sessions
          JOIN classroom_units
            ON activity_sessions.classroom_unit_id = classroom_units.id
          JOIN activities
            ON activity_sessions.activity_id = activities.id
          JOIN classrooms_teachers
            ON classrooms_teachers.classroom_id = classroom_units.classroom_id
          WHERE activity_sessions.is_final_score
            AND classrooms_teachers.user_id in (#{user_ids})
            AND activity_sessions.visible
            AND classroom_units.visible
            AND activities.standard_id = #{standard_id}
        )

        SELECT
          standards.id,
          standards.name,
          standard_levels.name as standard_level_name,
          COUNT(DISTINCT(final_activity_sessions.activity_id)) as total_activity_count,
          COUNT(DISTINCT(final_activity_sessions.user_id)) as total_student_count,
          COUNT(DISTINCT(avg_score_for_standard_by_user.user_id)) as proficient_count,
          ROUND(AVG(final_activity_sessions.timespent) * COUNT(DISTINCT(final_activity_sessions.id))) AS timespent
        FROM standards
        JOIN standard_levels
          ON standard_levels.id = standards.standard_level_id
        JOIN final_activity_sessions
          ON final_activity_sessions.standard_id = standards.id
        LEFT JOIN (
          SELECT
            standard_id,
            user_id,
            AVG(percentage) as avg_score
          FROM final_activity_sessions
          GROUP BY
            final_activity_sessions.standard_id,
            final_activity_sessions.user_id
          HAVING AVG(percentage) >= 0.8
        ) AS avg_score_for_standard_by_user
          ON avg_score_for_standard_by_user.standard_id = standards.id
        GROUP BY
          standards.id,
          standard_levels.name
      SQL
    ).to_a
  end

  def user_ids_query(admin_id)
    RawSqlRunner.execute(
      <<~SQL
        SELECT schools_users.user_id
        FROM users AS researcher
        JOIN schools_admins
          ON schools_admins.user_id = researcher.id
        JOIN schools
          ON schools.id = schools_admins.school_id
        JOIN schools_users
          ON schools_users.school_id = schools.id
        WHERE researcher.id = #{admin_id}
      SQL
    ).values.flatten.join(',')
  end
end
