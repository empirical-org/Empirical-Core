# SUM(CASE WHEN acts.is_final_score = true THEN acts.id ELSE 0 END) AS act_id
class Scorebook::Query
  SCORES_PER_PAGE = 200

  def self.run(classroom_id, current_page=1, unit_id=nil, begin_date=nil, end_date=nil)
  ActiveRecord::Base.connection.execute(
    "SELECT
       students.id AS user_id,
        ca.id AS ca_id,
        students.name AS name,
        activity.activity_classification_id,
        activity.name AS activity_name,
        MAX(acts.updated_at) AS updated_at,
        MAX(acts.percentage) AS percentage,
        SUM(CASE WHEN acts.percentage IS NOT NULL THEN 1 ELSE 0 END) AS completed_attempts,
        SUM(CASE WHEN acts.state = 'started' THEN 1 ELSE 0 END) AS started,
        SUM(CASE WHEN acts.is_final_score = true THEN acts.id ELSE 0 END) AS id
     FROM classrooms AS classroom
     LEFT JOIN students_classrooms AS sc on sc.classroom_id = classroom.id
     RIGHT JOIN users AS students ON students.id = sc.student_id
     INNER JOIN classroom_activities AS ca ON ca.classroom_id = classroom.id
     #{self.units(unit_id)&.first}
     LEFT JOIN activity_sessions AS acts ON (
           acts.classroom_activity_id = ca.id
           AND acts.user_id = students.id
           AND acts.visible = true
           )
     INNER JOIN activities AS activity ON activity.id = ca.activity_id
     WHERE classroom.id = #{classroom_id}
     AND ca.visible = true
     AND sc.visible = true
     #{self.units(unit_id)&.last}
     #{self.begin_date(begin_date)}
     #{self.end_date(end_date)}
     GROUP BY
      students.id,
       students.name, ca.id, activity.activity_classification_id, activity.name
     ORDER BY split_part( students.name, ' ' , 2),
       CASE WHEN SUM(CASE WHEN acts.percentage IS NOT NULL THEN 1 ELSE 0 END) > 0 THEN true ELSE false END DESC,
       MIN(acts.completed_at),
       CASE WHEN SUM(CASE WHEN acts.state = 'started' THEN 1 ELSE 0 END) > 0 THEN true ELSE false END DESC,
       ca.created_at ASC
       OFFSET (#{(current_page.to_i - 1) * SCORES_PER_PAGE})
       FETCH NEXT #{SCORES_PER_PAGE} ROWS ONLY"
      ).to_a
  end

  def self.units(unit_id)
    if unit_id && !unit_id.blank?
      ["INNER JOIN units ON ca.unit_id = units.id", "AND units.id = #{ActiveRecord::Base.sanitize(unit_id)}"]
    end
  end

  def self.begin_date(begin_date)
    if begin_date && !begin_date.blank?
      "AND acts.completed_at >= #{ActiveRecord::Base.sanitize(begin_date)}"
    end
  end

  def self.end_date(end_date)
    if end_date && !end_date.blank?
      "AND acts.completed_at <= #{ActiveRecord::Base.sanitize(end_date)}"
    end
  end


end
