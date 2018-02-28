class ProgressReports::DistrictConceptReports
  attr_reader :admin_id

  def initialize(admin_id)
    @admin_id = admin_id
  end

  def results
    ActiveRecord::Base.connection.execute(query).to_a
  end

  private

  def classroom_ids_for_admin
    Classroom.joins(teachers: { school: :admins })
      .where('schools_admins.user_id = ?', admin_id)
      .pluck(:id)
      .join(', ')
  end

  ## new query
  def query
    <<~SQL
    SELECT
      schools.name,
      teachers.name,
      classrooms.name,
      students.name,
      students.id
      SUM( CAST(concept_results.metadata->>'correct' as INT)) as correct,
      SUM( COUNT(*) - correct) as incorrect,
      (correct / SUM(COUNT(*)) * 100 as percentage
    FROM schools_admins
    JOIN schools ON schools.id = schools_admins.school_id
    JOIN schools_users on schools_users.school_id = schools.id
    JOIN users AS teachers on teachers.id = schools_users.user_id
    JOIN classrooms_teachers ON classrooms_teachers.user_id = teachers.id AND classrooms_teachers.role = 'owner'
    JOIN classrooms ON classrooms.id = classrooms_teachers.classroom_id
    JOIN classroom_activities ON classroom_activities.classroom_id = classrooms.id
    JOIN activity_sessions ON activity_sessions.classroom_activity_id = classroom_activities.id
    JOIN users AS students ON students.id = activity_sessions.user_id
    JOIN concept_results ON concept_results.activity_session_id = activity_sessions.id

    WHERE schools_admins.user_id = 209523
    GROUP BY students.id, schools.name, teachers.name, classrooms.name
    SQL
  end
  ### end new query

end

