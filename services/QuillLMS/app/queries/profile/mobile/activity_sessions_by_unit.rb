class Profile::Mobile::ActivitySessionsByUnit
  def query(student, classroom_id)
    all_act_seshes = student_profile_data_sql(classroom_id, student.id)
    grouped_sessions = group_by_unit(all_act_seshes)

    prepare_json(grouped_sessions)
  end


  private

  def student_profile_data_sql(classroom_id=nil, student_id=nil)
    ActiveRecord::Base.connection.execute(
      "SELECT unit.name,
       activity.name,
       activity.description,
       activity.repeatable,
       activity.activity_classification_id,
       unit.id AS unit_id,
       unit.created_at AS unit_created_at,
       unit.name AS unit_name,
       cu.id AS ca_id,
       cuas.completed AS marked_complete,
       ua.activity_id,
       MAX(acts.updated_at) AS act_sesh_updated_at,
       ua.due_date,
       cu.created_at AS unit_activity_created_at,
       cuas.locked,
       cuas.pinned,
       MAX(acts.percentage) AS max_percentage,
       SUM(CASE WHEN acts.state = 'started' THEN 1 ELSE 0 END) AS resume_link
    FROM unit_activities AS ua
    JOIN units AS unit ON unit.id = ua.unit_id
    JOIN classroom_units AS cu ON unit.id = cu.unit_id
    LEFT JOIN activity_sessions AS acts ON cu.id = acts.classroom_unit_id AND acts.visible = true
    AND acts.user_id = #{student_id}
    JOIN activities AS activity ON activity.id = ua.activity_id
    LEFT JOIN classroom_unit_activity_states AS cuas ON ua.id = cuas.unit_activity_id
    AND cu.id = cuas.classroom_unit_id
    WHERE #{classroom_id} = ANY (cu.assigned_student_ids::int[])
    AND cu.classroom_id = #{classroom_id}
    AND cu.visible = true
    AND unit.visible = true
    AND ua.visible = true
    GROUP BY ua.id, cu.id, activity.name, activity.description, ua.activity_id,
      unit.name, unit.id, unit.created_at, unit_name, activity.repeatable,
      activity.activity_classification_id, activity.repeatable, cuas.completed,
      cuas.locked, cuas.pinned
    ORDER BY pinned DESC, locked ASC, max_percentage DESC, ua.due_date ASC, unit.created_at ASC, cu.created_at ASC").to_a
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
          classroom_unit_id: activity_session["cu_id"],
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
