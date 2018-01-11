class ProgressReports::Standards::Classroom
  def initialize(teacher)
    @teacher = teacher
  end

  def results(filters)
    ::Classroom.with(user_info: ProgressReports::Standards::Student.new(@teacher).results(filters))
      .select("
        classrooms.name as name,
        classrooms.id as id,
        COUNT(DISTINCT(user_info.id)) as total_student_count,
        #{ProficiencyEvaluator.proficient_and_not_sql}"
      )
      .joins("INNER JOIN classrooms_teachers ON classrooms_teachers.user_id = #{@teacher.id} AND classrooms_teachers.classroom_id = classrooms.id")
      .joins(:students)
      .joins('INNER JOIN user_info ON user_info.id = users.id')
      .order("classrooms.name asc")
      .group("classrooms.id")
  end
end
