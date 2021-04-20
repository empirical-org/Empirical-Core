class Profile::Query

  def query(student, batch_size, offset, classroom_id)
    student.activity_sessions
           .joins(:activityactivity)
           .joins(:classroom_unit)
           .where("classroom_units.classroom_id = ?", classroom_id)
           .where("((state = 'finished') and (is_final_score = true)) or ((state != 'finished') and (is_retry = false))")
           .includes(classroom_unit: [:unit], activity: [:classification])
           .references(classroom_unit: [:unit])
           .order("units.created_at DESC")
           .order(unfinished_first)
           .order("classroom_units.due_date")
           .order("classroom_units.created_at")
  end

  private def unfinished_first
    "(state = 'finished')" # false will occur first since default ordering is ASC
  end

end
