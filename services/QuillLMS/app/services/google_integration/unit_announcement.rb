require 'google/api_client'

class GoogleIntegration::UnitAnnouncement
  include Rails.application.routes.url_helpers
  attr_reader :classroom_unit

  class GoogleApiError < StandardError; end

  def initialize(classroom_unit, client = nil)
    @classroom_unit = classroom_unit
    @client = client
  end

  def post
    make_request(classroom_unit.assigned_student_ids)
  end

  def update_recipients(new_recipients)
    make_request(new_recipients)
  end

  private def make_request(recipients)
    return unless can_post_to_google_classroom?

    handle_response { request(recipients) }
  rescue GoogleApiError => e
    NewRelic::Agent.add_custom_attributes({
      classroom_unit_id: @classroom_unit.id
    })
    NewRelic::Agent.notice_error(e)
    # If we get an error, report it to New Relic and bail
    nil
  end

  private def request(recipient_ids)
    client.execute(
      api_method: api_method,
      parameters: {
        courseId: google_course_id,
      },
      body: body(recipient_ids).to_json,
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

  private def body(recipient_ids)
    if individual_students?
      base_body.merge(individual_students_body(recipient_ids))
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

  private def unit
    classroom_unit.unit
  end

  private def user
    classroom.owner
  end

  private def google_course_id
    classroom.google_classroom_id
  end

  private def announcement_text
    unit_url = classroom_url(classroom.id, anchor: unit.id)

    "New Unit: #{unit.name} #{unit_url}"
  end

  private def individual_students?
    classroom_unit.assigned_student_ids.any? &&
    !classroom_unit.assign_on_join
  end

  private def individual_students_body(recipient_ids)
    {
      assigneeMode: "INDIVIDUAL_STUDENTS",
      individualStudentsOptions: {
        studentIds: assigned_student_ids_as_google_ids(recipient_ids)
      }
    }
  end

  private def assigned_student_ids_as_google_ids(assigned_student_ids)
    User.where(id: assigned_student_ids)
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
    classroom && classroom.google_classroom_id.present? && classroom.owner.post_google_classroom_assignments
  end
end
