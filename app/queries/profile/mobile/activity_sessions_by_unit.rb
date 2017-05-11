class Profile::Mobile::ActivitySessionsByUnit
  def query(student, classroom_id)
    all_act_seshes = student.activity_sessions
           .joins(:classroom_activity)
           .where("classroom_activities.classroom_id = ?", classroom_id)
           .where("((state = 'finished') and (is_final_score = true)) or ((state != 'finished') and (is_retry = false))")
           .includes(classroom_activity: [:unit], activity: [:classification])
           .references(classroom_activity: [:unit])
           .order("units.created_at DESC")
           .order("classroom_activities.due_date")
           .order("classroom_activities.created_at")
    grouped_sessions = group_by_unit(all_act_seshes)

    prepare_json(grouped_sessions)
  end


  private

  def prepare_json(grouped_sessions)
    # update grouped sessions so it only has an array of
    # the pertinent details for each act sesh
    grouped_sessions.each do |unit_name, activity_sessions|
      updated_act_seshes = activity_sessions.map do |activity_session|
        {
          uid: activity_session.uid,
          name: activity_session.activity.name,
          percentage: activity_session.percentage,
          classroom_activity_id: activity_session.classroom_activity_id,
          activity_classification_id: activity_session.activity.activity_classification_id
        }
      end
      grouped_sessions[unit_name] = updated_act_seshes
    end
  end

  def group_by_unit(all)
    all.select{|s| s.classroom_activity.unit.present?}
       .group_by{|s| s.classroom_activity.unit.name}
  end


end
