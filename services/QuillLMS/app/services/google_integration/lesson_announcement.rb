require 'google/api_client'

class GoogleIntegration::LessonAnnouncement
  attr_reader :classroom_unit, :unit_activity

  def initialize(classroom_unit, unit_activity, client = nil)
    @classroom_unit = classroom_unit
    @unit_activity = unit_activity
    @client = client
  end

  def post
    if can_post_to_google_classroom?
      handle_response { request }
    end
  end

  private

  def request
    client.execute(
      api_method: api_method,
      parameters: {
        courseId: google_course_id,
      },
      body: body.to_json,
      headers: {"Content-Type": 'application/json'}
    )
  end

  def handle_response(&request)
    response = JSON.parse(request.call.body, symbolize_names: true)
    if response.dig(:error, :status) == 'UNAUTHENTICATED'
      'UNAUTHENTICATED'
    else
      response
    end
  end

  def body
    if individual_students?
      base_body.merge(individual_students_body)
    else
      base_body
    end
  end

  def base_body
    {
      text: announcement_text
    }
  end

  def classroom
    classroom_unit.classroom
  end

  def user
    classroom.owner
  end

  def google_course_id
    classroom.google_classroom_id
  end

  def announcement_text
    activity_url  = ActivitySession.generate_activity_url(
      classroom_unit.id,
      unit_activity.activity.id
    )
    activity_name = unit_activity.activity.name

    "New Activity: #{activity_name} #{activity_url}"
  end

  def individual_students?
    classroom_unit.assigned_student_ids.any? &&
    !classroom_unit.assign_on_join
  end

  def individual_students_body
    {
      assigneeMode: "INDIVIDUAL_STUDENTS",
      individualStudentsOptions: {
        studentIds: assigned_student_ids_as_google_ids
      }
    }
  end

  def assigned_student_ids_as_google_ids
    User.where(id: classroom_unit.assigned_student_ids)
      .pluck(:google_id)
      .compact
  end

  def client
    @client ||= GoogleIntegration::Client.new(user).create
  end

  def api_method
    client.discovered_api('classroom', 'v1').courses.announcements.create
  end

  def can_post_to_google_classroom?
    classroom.google_classroom_id.present?
  end
end
