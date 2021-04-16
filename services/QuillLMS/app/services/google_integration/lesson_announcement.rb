require 'google/api_client'

class GoogleIntegration::LessonAnnouncement
  attr_reader :classroom_unit, :unit_activity

  class GoogleApiError < StandardError; end

  def initialize(classroom_unit, unit_activity, client = nil)
    @classroom_unit = classroom_unit
    @unit_activity = unit_activity
    @client = client
  end

  def post
    return unless can_post_to_google_classroom?

    handle_response { request }
  rescue GoogleApiError => e
    NewRelic::Agent.add_custom_attributes({
      classroom_unit_id: @classroom_unit.id,
      unit_activity_id: @unit_activity.id
    })
    NewRelic::Agent.notice_error(e)
    # If we get an error, report it to New Relic and bail
    nil
  end

  private def request
    client.execute(
      api_method: api_method,
      parameters: {
        courseId: google_course_id,
      },
      body: body.to_json,
      headers: {"Content-Type": 'application/json'}
    )
  end

  private def handle_response(&request)
    response = request.call
    body = JSON.parse(response.body, symbolize_names: true)
    raise(GoogleApiError, body) if response.status != 200
    if body.dig(:error, :status) == 'UNAUTHENTICATED'
      'UNAUTHENTICATED'
    else
      body
    end
  end

  private def body
    if individual_students?
      base_body.merge(individual_students_body)
    else
      base_body
    end
  end

  private def base_body
    {
      text: announcement_text
    }
  end

  private def classroom
    classroom_unit.classroom
  end

  private def user
    classroom.owner
  end

  private def google_course_id
    classroom.google_classroom_id
  end

  private def announcement_text
    activity_url  = ActivitySession.generate_activity_url(
      classroom_unit.id,
      unit_activity.activity.id
    )
    activity_name = unit_activity.activity.name

    "New Activity: #{activity_name} #{activity_url}"
  end

  private def individual_students?
    classroom_unit.assigned_student_ids.any? &&
    !classroom_unit.assign_on_join
  end

  private def individual_students_body
    {
      assigneeMode: "INDIVIDUAL_STUDENTS",
      individualStudentsOptions: {
        studentIds: assigned_student_ids_as_google_ids
      }
    }
  end

  private def assigned_student_ids_as_google_ids
    User.where(id: classroom_unit.assigned_student_ids)
      .pluck(:google_id)
      .compact
  end

  private def client
    @client ||= GoogleIntegration::Client.new(user).create
  end

  private def api_method
    client.discovered_api('classroom', 'v1').courses.announcements.create
  end

  private def can_post_to_google_classroom?
    classroom.google_classroom_id.present? && classroom.owner.post_google_classroom_assignments
  end
end
