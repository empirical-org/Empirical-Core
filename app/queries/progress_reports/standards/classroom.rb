class ProgressReports::Standards::Classroom
  def initialize(teacher)
    @teacher = teacher
  end

  def results(filters)
    Classroom.with(user_info: ProgressReports::Standards::Student.new(@teacher).results(filters))
      .select(<<-SQL
        classrooms.name as name,
        classrooms.id as id,
        classrooms.teacher_id,
        COUNT(DISTINCT(user_info.id)) as total_student_count,
        SUM(CASE WHEN user_info.average_score > 0.75 THEN 1 ELSE 0 END) as proficient_student_count,
        SUM(CASE WHEN user_info.average_score >= 0.50 AND user_info.average_score <= 0.75 THEN 1 ELSE 0 END) as near_proficient_student_count,
        SUM(CASE WHEN user_info.average_score <= 0.75 THEN 1 ELSE 0 END) as not_proficient_student_count
      SQL
      )
      .joins(:students)
      .joins('INNER JOIN user_info ON user_info.id = users.id')
      .order("classrooms.name asc")
      .group("classrooms.id")
  end
end
