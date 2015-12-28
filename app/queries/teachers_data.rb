module TeachersData

  # num_students
  # num_concepts_completd
  # num_time_spent


  def self.run(teacher_ids)
    teachers = User.arel_table.alias('teacher')
    classrooms = Classroom.arel_table
    students = USer.arel_table.alias('students')

    x = teachers.where(id: teacher_ids)
            .join(classrooms).on(teachers[:id].eq(classrooms[:teacher_id]))
            .join(students).on(classrooms[:code].eq(students[:classcode]))
            .group(teachers[:id])
            .project(teachers[:id],
                     students.count.distinct.as('number_of_students'))

    ts = User.find_by_sql(x)
  end

end