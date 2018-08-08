class ProgressReports::DistrictStandardsReports
  attr_reader :admin_id

  def initialize(admin_id)
    @admin_id = admin_id
  end

  def results
    # Uncomment the line below, and comment out the sql query, to bypass
    # The database while testing
    # [{"id"=>"1", "name"=>"class 1b", "section_name"=>"how to tell cactus from cow", "total_activity_count"=>"2", "total_student_count"=>"33", "proficient_count"=>"15"}]
    ActiveRecord::Base.connection.execute(query).to_a

  end

  private

  def query
    <<~SQL
    WITH final_activity_sessions AS (
      SELECT activity_sessions.*, activities.topic_id FROM activity_sessions
        JOIN classroom_units ON activity_sessions.classroom_unit_id = classroom_units.id
        JOIN activities ON activity_sessions.activity_id = activities.id
        JOIN topics ON topics.id = activities.topic_id
        JOIN classrooms_teachers on classrooms_teachers.classroom_id = classroom_units.classroom_id
        WHERE activity_sessions.is_final_score
        AND classrooms_teachers.user_id in (SELECT schools_users.user_id FROM users as researcher
          JOIN schools_admins ON schools_admins.user_id = researcher.id
          JOIN schools ON schools.id = schools_admins.school_id
          JOIN schools_users ON schools_users.school_id = schools.id
          WHERE researcher.id = #{admin_id}
        )
        AND activity_sessions.visible
            AND classroom_units.visible
    ) SELECT
        topics.id,
        topics.name,
        sections.name as section_name,
        COUNT(DISTINCT(final_activity_sessions.activity_id)) as total_activity_count,
        COUNT(DISTINCT(final_activity_sessions.user_id)) as total_student_count,
        COUNT(DISTINCT(avg_score_for_topic_by_user.user_id)) as proficient_count
      FROM topics
        JOIN sections ON sections.id = topics.section_id
        JOIN final_activity_sessions ON final_activity_sessions.topic_id = topics.id
        LEFT JOIN (SELECT topic_id, user_id, AVG(percentage) as avg_score
          FROM final_activity_sessions
          GROUP BY final_activity_sessions.topic_id, final_activity_sessions.user_id
          HAVING AVG(percentage) >= 0.8
        ) AS avg_score_for_topic_by_user ON avg_score_for_topic_by_user.topic_id = topics.id
      GROUP BY topics.id, sections.name
      ORDER BY topics.name ASC;
   SQL
  end

end
