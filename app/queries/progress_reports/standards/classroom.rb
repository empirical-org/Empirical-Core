class ProgressReports::Standards::Classroom
  def initialize(teacher)
    @teacher = teacher
  end

  def results(filters)
    Classroom.with(user_info: ProgressReports::Standards::Student.new(@teacher).results(filters))
      .select("
        classrooms.name as name,
        classrooms.id as id,
        classrooms.teacher_id,
        COUNT(DISTINCT(user_info.id)) as total_student_count,
        #{ProficiencyEvaluator.proficient_and_not_sql}"
      )
      .where(teacher: @teacher)
      .joins(:students)
      .joins('INNER JOIN user_info ON user_info.id = users.id')
      .order("classrooms.name asc")
      .group("classrooms.id")
  end
end
