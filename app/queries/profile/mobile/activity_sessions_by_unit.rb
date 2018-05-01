class Profile::Mobile::ActivitySessionsByUnit
  def query(student, classroom_id)
    all_act_seshes = student_profile_data_sql(classroom_id, student.id)
    grouped_sessions = group_by_unit(all_act_seshes)

    prepare_json(grouped_sessions)
  end


  private

  def student_profile_data_sql(classroom_id=nil, student_id=nil)
    ActiveRecord::Base.connection.execute(
      "SELECT unit.name AS unit_name,
       activity.uid AS uid,
       activity.name,
       activity.description,
       activity.repeatable,
       activity.activity_classification_id,
       unit.id AS unit_id,
       unit.created_at AS unit_created_at,
       ca.id AS ca_id,
       ca.completed AS marked_complete,
       ca.activity_id,
       MAX(acts.updated_at) AS act_sesh_updated_at,
       ca.due_date,
       ca.created_at AS classroom_activity_created_at,
       ca.locked,
       ca.pinned,
       MAX(acts.percentage) AS max_percentage,
       SUM(CASE WHEN acts.state = 'started' THEN 1 ELSE 0 END) AS resume_link
    FROM classroom_activities AS ca
    LEFT JOIN activity_sessions AS acts ON ca.id = acts.classroom_activity_id AND acts.visible = true AND acts.user_id = #{student_id}
    JOIN units AS unit ON unit.id = ca.unit_id
    JOIN activities AS activity ON activity.id = ca.activity_id
    WHERE #{student_id} = ANY (ca.assigned_student_ids::int[])
    AND ca.classroom_id = #{classroom_id}
    AND ca.visible = true
    AND unit.visible = true
    GROUP BY ca.id, activity.uid, activity.name, activity.description, acts.activity_id,
            unit.name, unit.id, unit.created_at, unit_name, activity.repeatable,
            activity.activity_classification_id, activity.repeatable
    ORDER BY pinned DESC, locked ASC, max_percentage DESC, unit.created_at ASC, ca.created_at ASC").to_a
  end

  def prepare_json(grouped_sessions)
    # update grouped sessions so it only has an array of
    # the pertinent details for each act sesh
    grouped_sessions.each do |unit_name, activity_sessions|
      updated_act_seshes = activity_sessions.map do |activity_session|
        {
          uid: activity_session["uid"],
          name: activity_session["name"],
          percentage: activity_session["max_percentage"],
          classroom_activity_id: activity_session["ca_id"],
          activity_classification_id: activity_session["activity_classification_id"]
        }
      end
      grouped_sessions[unit_name] = updated_act_seshes
    end
  end

  def group_by_unit(all)
    all.select{|s| s["unit_name"].present?}.group_by{|s| s["unit_name"]}
  end


end
