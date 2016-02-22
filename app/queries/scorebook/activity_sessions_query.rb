class Scorebook::ActivitySessionsQuery

  def query(teacher, classroom_id=nil)
    if classroom_id.present?
      users = Classroom.find(classroom_id).students
    else
      users = teacher.classrooms.includes(:students).map(&:students).flatten.compact.uniq
    end

    # Find all the 'final' activity sessions for all the students in all the classrooms
    results = ActivitySession.select("users.name, activity_sessions.id, activity_sessions.percentage,
                                #{User.sorting_name_sql}").preload(concept_results: :concept)
                              .includes(:user, :classroom_activity, activity: [:classification, topic: [:section, :topic_category]])
                              .references(:user)
                              .where(user: users)
                              .where('(activity_sessions.is_final_score = true) or ((activity_sessions.completed_at IS NULL) and activity_sessions.is_retry = false)
                                and classroom_activities.assigned_student_ids IS NOT NULL')

    results
  end
end
