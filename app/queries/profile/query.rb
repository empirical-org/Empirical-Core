class Profile::Query
  def query(student)

    store = {
      ids: [],
      sessions: []
    }

    finished_sessions = student.activity_sessions.includes(:unit, classroom_activity: [:unit], activity: [:classification])
                        .where(state: "finished")
                        .sort_by {|s| s.percentage}
                        .reverse

    classroom_ids = finished_sessions.map{|s| s.classroom_activity_id}.uniq

    other_sessions = not_finished_query(classroom_ids, student)

    sessions = finished_sessions + other_sessions

    sessions.each do |s|
      unless store[:ids].include?(s.classroom_activity_id)
        store[:ids].push(s.classroom_activity_id)
        store[:sessions].push(s)
      end
    end
    return store[:sessions]
  end

  def not_finished_query classroom_ids, student
    if classroom_ids.empty?
      student.activity_sessions.includes(:unit, classroom_activity: [:unit], activity: [:classification])
    else
      student.activity_sessions.where("classroom_activity_id NOT IN (?)", classroom_ids).includes(:unit, classroom_activity: [:unit], activity: [:classification])
    end
  end

end
