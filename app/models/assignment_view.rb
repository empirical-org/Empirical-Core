class AssignmentView < ClassroomActivity
  def choose_everyone
    assigned_student_ids.nil? || assigned_student_ids.empty?
  end

  def assigned_student_ids= ids
    return super if ids.nil?
    super ids.map(&:to_i)
  end

  def choose_everyone= val
    if val == '1'
      self.assigned_student_ids = nil
    end
  end
end
