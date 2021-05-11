class ProgressReports::Standards::Classroom
  def initialize(teacher)
    @teacher = teacher
  end

  def results(filters)
    user_info_query = ProgressReports::Standards::Student.new(@teacher).results(filters).to_sql
    user_info = "( #{user_info_query} ) AS user_info"

    ::Classroom
      .select(
        <<-SQL
          classrooms.name AS name,
          classrooms.id AS id,
          COUNT(DISTINCT(user_info.id)) AS total_student_count,
          #{ProficiencyEvaluator.proficient_and_not_sql}
        SQL
      )
      .joins(
        <<-SQL
          JOIN classrooms_teachers
            ON classrooms_teachers.user_id = #{@teacher.id}
           AND classrooms_teachers.classroom_id = classrooms.id
        SQL
      )
      .joins(:students)
      .joins("JOIN #{user_info} ON user_info.id = users.id")
      .order("classrooms.name ASC")
      .group("classrooms.id")
  end
end
