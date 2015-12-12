class Profile::Query
  def query(student, batch_size, offset)
    student.activity_sessions
      .where("((state = 'finished') and (is_final_score = true)) or ((state != 'finished') and (is_retry = false))")
      .includes(classroom_activity: [:unit], activity: [:classification])
      .limit(batch_size)
      .offset(offset)
      .references(classroom_activity: [:unit])
      .order('units.created_at DESC')
      .order(unfinished_first)
      .order('classroom_activities.due_date')
      .order('activity_sessions.created_at')
  end

  private

  def unfinished_first
    "(state = 'finished')" # false will occur first since default ordering is ASC
  end
end
