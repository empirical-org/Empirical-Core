module TeachersData
  # AVERAGE_TIME_SPENT was gathered from below query on 1/4/2016
  # https://dataclips.heroku.com/tympuxntqzshpmngbnbivaectbqm-average-time-per-activity_session?autosave=true
  AVERAGE_TIME_SPENT = 441 # (seconds)  ie "interval '7 minutes 21 seconds'"



  # num_students
  # num_questions_completd
  # num_time_spent

  # use Outer Joins to account for the fact that some of the teachers shown in the admin dashboard
  # will have no classrooms, etc.

  def self.run(teacher_ids)
    teachers = User.arel_table
    classrooms = Classroom.arel_table
    classrooms_teachers = ClassroomsTeacher.arel_table
    students_classrooms = StudentsClassrooms.arel_table
    students = User.arel_table.alias('students')
    activity_sessions = ActivitySession.arel_table
    concept_results = ConceptResult.arel_table

    x = teachers.project(teachers[:id])
                .where(teachers[:id].in(teacher_ids))
                .join(classrooms_teachers, Arel::Nodes::OuterJoin).on(teachers[:id].eq(classrooms_teachers[:user_id]))
                .join(classrooms, Arel::Nodes::OuterJoin).on(classrooms_teachers[:classroom_id].eq(classrooms[:id]))
                .join(students_classrooms, Arel::Nodes::OuterJoin).on(classrooms[:id].eq(students_classrooms[:classroom_id]))
                .join(students, Arel::Nodes::OuterJoin).on(students_classrooms[:student_id].eq(students[:id]))
                .join(activity_sessions, Arel::Nodes::OuterJoin).on(students[:id].eq(activity_sessions[:user_id]))
                .join(concept_results, Arel::Nodes::OuterJoin).on(activity_sessions[:id].eq(concept_results[:activity_session_id]))
                .group(teachers[:id])
                .project(teachers[:id], teachers[:name], teachers[:email],
                         students[:id].count(true).as('number_of_students'),
                         concept_results[:id].count(true).as('number_of_questions_completed'))


   y = teachers.project(teachers[:id].as('teacher_id'),
                        activity_sessions[:id].as('activity_session_id'))
               .where(teachers[:id].in(teacher_ids))
               .join(classrooms_teachers).on(teachers[:id].eq(classrooms_teachers[:user_id]))
               .join(classrooms).on(classrooms_teachers[:classroom_id].eq(classrooms[:id]))
               .join(students_classrooms).on(classrooms[:id].eq(students_classrooms[:classroom_id]))
               .join(students).on(students_classrooms[:student_id].eq(students[:id]))
               .join(activity_sessions).on(students[:id].eq(activity_sessions[:user_id]))
               .where(activity_sessions[:state].eq('finished'))
               .group(teachers[:id], activity_sessions[:id])
               .as('acss_ids')

   z = activity_sessions.join(y).on(activity_sessions[:id].eq(y[:activity_session_id]))
                        .group(y[:teacher_id])
                        .project(y[:teacher_id],
                                 self.time_spent.as('time_spent'))
                        .as('time_spent_query')

   z2 = x.join(z, Arel::Nodes::OuterJoin).on(teachers[:id].eq(z[:teacher_id]))
         .project(z[:time_spent].maximum.as('time_spent'))


    ts = User.find_by_sql(z2)
  end

  private

  def self.time_spent
    string = "
      SUM (
        CASE
        WHEN (activity_sessions.started_at IS NULL)
          OR (activity_sessions.completed_at IS NULL)
          OR (activity_sessions.completed_at - activity_sessions.started_at < interval '1 minute')
          OR (activity_sessions.completed_at - activity_sessions.started_at > interval '30 minutes')
        THEN #{AVERAGE_TIME_SPENT}
        ELSE
          EXTRACT (
            'epoch' FROM (activity_sessions.completed_at - activity_sessions.started_at)
          )
        END
      )
    "
    Arel::Nodes::SqlLiteral.new(string)
  end
end
