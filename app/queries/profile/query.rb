class Profile::Query

  def query(student, batch_size, offset)
    student.activity_sessions
           .where("((state = 'finished') and (is_final_score = true)) or ((state != 'finished') and (is_retry = false))")
           .includes(classroom_activity: [:unit], activity: [:classification])
           .limit(batch_size)
           .offset(offset)
  end

end
