module TeachersData

  # num_students
  # num_questions_completd
  # num_time_spent


  def self.run(teacher_ids)
    teachers = User.arel_table
    classrooms = Classroom.arel_table
    students = User.arel_table.alias('students')
    activity_sessions = ActivitySession.arel_table
    concept_results = ConceptResult.arel_table

    x = teachers.project(teachers[:id]).where(teachers[:id].in(teacher_ids))
            .join(classrooms, Arel::Nodes::OuterJoin).on(teachers[:id].eq(classrooms[:teacher_id]))
            .join(students, Arel::Nodes::OuterJoin).on(classrooms[:code].eq(students[:classcode]))
            .join(activity_sessions, Arel::Nodes::OuterJoin).on(students[:id].eq(activity_sessions[:user_id]))
            .join(concept_results, Arel::Nodes::OuterJoin).on(activity_sessions[:id].eq(concept_results[:activity_session_id]))
            .group(teachers[:id])
            .project(teachers[:id], teachers[:name], teachers[:email],
                     students[:id].count(true).as('number_of_students'),
                     concept_results[:id].count(true).as('number_of_questions_completed'))

    ts = User.find_by_sql(x)
  end

end

=begin
concept_results_completed
  join students to activity_sessions



=end