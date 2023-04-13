# frozen_string_literal: true

class ProgressReports::DistrictConceptReports
  attr_reader :admin_id

  def initialize(admin_id)
    @admin_id = admin_id
  end

  def results
    # Uncomment the line below, and comment out the active record line
    # in order to bypass the database while testing
    # [{"school_name"=>"Hogwarts", "teacher_name"=>"Severus Snape", "classroom_name"=>"Potions III", "student_name"=>"Ron Weasley", "correct"=>"15", "incorrect"=>"8", "percentage"=>"65"}]
    QuillBigQuery.execute(query)
  end

  private def query
    # For testing, see the Metabase version of this query: https://data.quill.org/question/1026-progressreports-districtconceptreports
    <<~SQL
      WITH results AS (
        SELECT
          schools.name AS school_name,
          teachers.name AS teacher_name,
          classrooms.name AS classroom_name,
          MAX(students.name) AS student_name,
          students.id AS student_id,
          SUM(CAST(concept_results.correct as INT64)) AS correct,
          COUNT(concept_results) AS concept_results_count
        FROM lms.schools_admins
        JOIN lms.schools
          ON schools.id = schools_admins.school_id
        JOIN lms.schools_users
          ON schools_users.school_id = schools.id
        JOIN lms.users AS teachers
          ON teachers.id = schools_users.user_id
        JOIN lms.classrooms_teachers
          ON classrooms_teachers.user_id = teachers.id
          AND classrooms_teachers.role = 'owner'
        JOIN lms.classrooms
          ON classrooms.id = classrooms_teachers.classroom_id
        JOIN lms.classroom_units
          ON classroom_units.classroom_id = classrooms.id
        JOIN lms.activity_sessions
          ON activity_sessions.classroom_unit_id = classroom_units.id
        JOIN lms.users AS students
          ON students.id = activity_sessions.user_id
        JOIN special.concept_results
          ON concept_results.activity_session_id = activity_sessions.id
        WHERE schools_admins.user_id = #{admin_id}
        GROUP BY
          student_id,
          teacher_name,
          classroom_name,
          school_name
      )

      SELECT
        school_name,
        teacher_name,
        classroom_name,
        student_name,
        correct,
        (concept_results_count - correct) as incorrect,
        FLOOR( correct/concept_results_count * 100 ) as percentage
      FROM results;
    SQL
  end

end
