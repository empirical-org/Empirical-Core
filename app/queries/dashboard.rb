module Dashboard

  def self.struggling_students(user)
    averages = {}
    user = User.find user.id
    students = user.students.map(&:id)
    sessions = ActivitySession.where(user_id: students)
    sessions = sessions.where(["completed_at > ?", 30.days.ago])
    if sessions.count > 30
      return
    end
    sessions = sessions.group_by(&:user_id)
    sessions.each do |u, s|
      total = s.sum(&:percentage)
      averages[u] = total/(sessions[u].count)
    end
    averages.sort_by{|user, score| score}[0..4].to_json
    end
  end


  def self.difficult_concepts

  end


end
