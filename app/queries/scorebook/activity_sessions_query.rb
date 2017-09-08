class Scorebook::ActivitySessionsQuery

  def query(teacher, classroom_id=nil)
    if classroom_id.present?
      users = Classroom.find(classroom_id).students
      classroom_ids = [classroom_id]
    else
      users = teacher.classrooms_i_teach.includes(:students).map(&:students).flatten.compact.uniq
      classroom_ids = teacher.classrooms_i_teach.map(&:id)
    end



    # Find all the 'final' activity sessions for all the students in all the classrooms
    results = ActivitySession.select("users.name, activity_sessions.id, activity_sessions.percentage,
                                #{User.sorting_name_sql}")
                              .includes(:user, activity: [:classification])
                              .references(:user)
                              .joins('JOIN  classroom_activities ON classroom_activities.id = activity_sessions.classroom_activity_id')
                              .where('classroom_activities.classroom_id IN (?)', classroom_ids)
                              .where(user: users)
                              .where('(activity_sessions.is_final_score = true) or ((activity_sessions.completed_at IS NULL) and activity_sessions.is_retry = false)')

    results
  end
end
