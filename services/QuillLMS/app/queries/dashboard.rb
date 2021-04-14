class Dashboard
  SUFFICIENT_DATA_AMOUNT = 30
  RESULT_LIMITS = 5

  def self.queries(user)
    get_redis_values(user)
    strug_stud = @@cached_strug_stud
    diff_con = @@cached_diff_con
    unless @@cached_strug_stud && @@cached_diff_con
      completed_count = completed_activity_count(user.id)
      if !completed_count || completed_count == 0
        strug_stud = 'insufficient data'
        diff_con = 'insufficient data'
      end
      if completed_count >= SUFFICIENT_DATA_AMOUNT
        user_id = user.id
        diff_con ||= difficult_concepts(user_id)
        strug_stud ||= lowest_performing_students(user_id)
        if diff_con.empty?
          diff_con = 'insufficient data'
        end
      else
        strug_stud = 'insufficient data'
        diff_con = 'insufficient data'
      end
    end
    set_cache_if_empty(strug_stud, diff_con, user)
    results = [
              {header: 'Lowest Performing Students', results: strug_stud},
              {header: 'Difficult Concepts', results: diff_con}
]
  end

  def self.completed_activity_count(user_id)
    ActiveRecord::Base.connection.execute("SELECT COUNT(DISTINCT acts.id) FROM activity_sessions as acts
    #{body_of_sql_search(user_id)}").to_a.first["count"].to_i
  end

  def self.lowest_performing_students(user_id)
    ActiveRecord::Base.connection.execute(
        "SELECT students.name, (AVG(acts.percentage)*100) AS score FROM activity_sessions as acts
        #{body_of_sql_search(user_id)}
        GROUP BY students.id
        ORDER BY score
        LIMIT #{RESULT_LIMITS}").to_a
  end

  def self.body_of_sql_search(user_id)
    "JOIN users AS students ON students.id = acts.user_id
     JOIN students_classrooms AS sc ON sc.student_id = students.id
     JOIN classrooms ON sc.classroom_id = classrooms.id
     JOIN classrooms_teachers ON classrooms_teachers.classroom_id = classrooms.id
     WHERE classrooms_teachers.user_id = #{user_id}
     AND sc.visible = true
     AND classrooms.visible = true
     AND acts.percentage IS NOT null
     AND acts.visible IS true
     AND #{completed_since_sql}"
  end

  def self.completed_since_sql
    "acts.completed_at > date_trunc('day', NOW() - interval '30 days')"
  end

  def self.difficult_concepts(user_id)
    ActiveRecord::Base.connection.execute("
    SELECT concepts.id, concepts.name, AVG((concept_results.metadata::json->>'correct')::int) * 100  AS score, (CASE WHEN AVG((concept_results.metadata::json->>'correct')::int) *100 > 0 THEN true ELSE false END) AS non_zero
      FROM activity_sessions as acts
    JOIN classroom_units ON classroom_units.id = acts.classroom_unit_id
    JOIN concept_results ON acts.id = concept_results.activity_session_id
    JOIN concepts ON concepts.id = concept_results.concept_id
    JOIN classrooms_teachers ON classrooms_teachers.classroom_id = classroom_units.classroom_id
    WHERE classrooms_teachers.user_id = #{user_id} AND acts.percentage IS NOT null AND acts.visible IS true AND #{completed_since_sql}
    GROUP BY concepts.id
    ORDER BY non_zero DESC, score
    LIMIT #{RESULT_LIMITS}").to_a
  end


  def self.set_cache_if_empty(strug_stud, diff_con, user)
    unless @@cached_strug_stud || strug_stud == 'insufficient data'
      $redis.set("user_id:#{user.id}_struggling_students", strug_stud.to_json, {ex: 16.hours})
    end
    unless @@cached_diff_con || diff_con == 'insufficient data'
      $redis.set("user_id:#{user.id}_difficult_concepts", diff_con.to_json, {ex: 16.hours})
    end
  end

  def self.get_redis_values(user)
    strug_stud = $redis.get("user_id:#{user.id}_struggling_students")
    diff_con = $redis.get("user_id:#{user.id}_difficult_concepts")
    # don't use cache if it doesn't exist or is blank
    @@cached_strug_stud = strug_stud.nil? || strug_stud&.blank? ? nil : JSON.parse(strug_stud)
    @@cached_diff_con = diff_con.nil? || diff_con&.blank? ? nil : JSON.parse(diff_con)
  end


end
