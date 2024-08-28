# frozen_string_literal: true

class ProgressReports::DistrictStandardsReports
  attr_reader :admin_id, :is_freemium

  PROFICIENT_THRESHOLD = 0.8
  FREEMIUM_LIMIT = 10

  def initialize(admin_id, is_freemium = nil)
    @admin_id = admin_id
    @is_freemium = is_freemium
  end

  def results
    # Uncomment the line below, and comment out the sql query, to bypass
    # The database while testing
    # [{"id"=>"1", "name"=>"class 1b", "standard_level_name"=>"how to tell cactus from cow", "total_activity_count"=>"2", "total_student_count"=>"33", "proficient_count"=>"15"}]
    user_ids = user_ids_query(admin_id)
    return [] if user_ids.empty?

    standards_results = Standard
      .all
      .pluck(:id)
      .map { |standard_id| standards_report_query(user_ids, standard_id) }
      .flatten
      .sort_by { |k| k['name'] }
    standards_results = standards_results.take(FREEMIUM_LIMIT) if @is_freemium
    standards_results
  end

  def standards_report_query(user_ids, standard_id)
    QuillBigQuery::Runner.execute(
      <<-SQL
        WITH final_activity_sessions AS (
          SELECT
            activity_sessions.activity_id,
            activity_sessions.id,
            activity_sessions.percentage,
            activity_sessions.timespent,
            activity_sessions.user_id,
            activities.standard_id
            FROM lms.activity_sessions AS activity_sessions
            JOIN lms.classroom_units AS classroom_units
              ON activity_sessions.classroom_unit_id = classroom_units.id
            JOIN lms.activities AS activities
              ON activity_sessions.activity_id = activities.id
            JOIN lms.classrooms_teachers
              ON classrooms_teachers.classroom_id = classroom_units.classroom_id
            WHERE activity_sessions.is_final_score
            AND classrooms_teachers.user_id in (#{user_ids})
            AND activity_sessions.visible
            AND classroom_units.visible
            AND activities.standard_id = #{standard_id}
        )

        SELECT
          standards.id,
          MAX(standards.name) AS name,
          standard_levels.name as standard_level_name,
          COUNT(DISTINCT(final_activity_sessions.activity_id)) as total_activity_count,
          COUNT(DISTINCT(final_activity_sessions.user_id)) as total_student_count,
          COUNT(DISTINCT(final_activity_sessions.user_id)) FILTER (WHERE final_activity_sessions.score IS NOT NULL) AS total_scored_students_count,
          COUNT(DISTINCT(avg_score_for_standard_by_user.user_id)) as proficient_count,
          ROUND(AVG(final_activity_sessions.timespent) * COUNT(DISTINCT(final_activity_sessions.id))) AS timespent
        FROM lms.standards
        JOIN lms.standard_levels
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
          HAVING AVG(percentage) >= #{PROFICIENT_THRESHOLD}
        ) AS avg_score_for_standard_by_user
          ON avg_score_for_standard_by_user.standard_id = standards.id
        GROUP BY
          standards.id,
          standard_levels.name
      SQL
    )
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
