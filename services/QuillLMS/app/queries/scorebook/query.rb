# SUM(CASE WHEN acts.is_final_score = true THEN acts.id ELSE 0 END) AS act_id
class Scorebook::Query
  SCORES_PER_PAGE = 200

  def self.run(classroom_id, current_page=1, unit_id=nil, begin_date=nil, end_date=nil)
    ActiveRecord::Base.connection.execute(
    "SELECT
       students.id AS user_id,
        ca.id AS ca_id,
        ca.completed AS marked_complete,
        students.name AS name,
        activity.activity_classification_id,
        activity.name AS activity_name,
        activity.description AS activity_description,
        MAX(acts.updated_at) AS updated_at,
        MIN(acts.started_at) AS started_at,
        MAX(acts.percentage) AS percentage,
        SUM(CASE WHEN acts.percentage IS NOT NULL THEN 1 ELSE 0 END) AS completed_attempts,
        SUM(CASE WHEN acts.state = 'started' THEN 1 ELSE 0 END) AS started,
        SUM(CASE WHEN acts.is_final_score = true THEN acts.id ELSE 0 END) AS id
     FROM classroom_activities AS ca
     LEFT JOIN students_classrooms AS sc on ca.classroom_id = sc.classroom_id
     RIGHT JOIN users AS students ON students.id = sc.student_id
     #{self.units(unit_id)&.first}
     LEFT JOIN activity_sessions AS acts ON (
           acts.classroom_activity_id = ca.id
           AND acts.user_id = students.id
           AND acts.visible = true
           )
     INNER JOIN activities AS activity ON activity.id = ca.activity_id
     WHERE ca.classroom_id = #{classroom_id}
     AND  students.id = ANY (ca.assigned_student_ids::int[])
     AND ca.visible = true
     AND sc.visible = true
     #{self.units(unit_id)&.last}
     #{self.date_conditional_string(begin_date, end_date)}
     GROUP BY
      students.id,
       students.name, ca.id, activity.activity_classification_id, activity.name, activity.description
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

  def self.sanitize_date(date)
    return ActiveRecord::Base.sanitize(date) if date && !date.blank?
  end

  def self.date_conditional_string(begin_date, end_date)
    new_end_date = end_date ? (Date.parse(end_date) + 1.days).to_s : end_date
    sanitized_begin_date = self.sanitize_date(begin_date)
    sanitized_end_date = self.sanitize_date(new_end_date)
    return unless sanitized_begin_date || sanitized_end_date
    "AND (
      CASE
      WHEN acts.completed_at IS NOT NULL THEN
        #{self.date_substring_for_acts_completed_at(sanitized_begin_date, sanitized_end_date)}
      WHEN acts.started_at IS NOT NULL THEN
        #{self.date_substring_for_acts_started_at(sanitized_begin_date, sanitized_end_date)}
      ELSE
        #{self.date_substring_for_ca_created_at(sanitized_begin_date, sanitized_end_date)}
      END
    )"
  end

  def self.date_substring_for_acts_completed_at(begin_date, end_date)
    [
      begin_date ? "acts.completed_at >= #{begin_date}" : nil,
      end_date ? "acts.completed_at <= #{end_date}" : nil
    ].reject(&:nil?).join(' AND ')
  end

  def self.date_substring_for_acts_started_at(begin_date, end_date)
    [
      begin_date ? "acts.started_at >= #{begin_date}" : nil,
      end_date ? "acts.started_at <= #{end_date}" : nil
    ].reject(&:nil?).join(' AND ')

  end

  def self.date_substring_for_ca_created_at(begin_date, end_date)
    [
      begin_date ? "ca.created_at >= #{begin_date}" : nil,
      end_date ? "ca.created_at <= #{end_date}" : nil
    ].reject(&:nil?).join(' AND ')
  end

end
