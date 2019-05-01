require 'google/api_client'

class GoogleIntegration::UnitAnnouncement
  include Rails.application.routes.url_helpers
  attr_reader :classroom_unit

  def initialize(classroom_unit, client = nil)
    @classroom_unit = classroom_unit
    @client = client
  end

  def post
    make_request(classroom_unit.assigned_student_ids)
  end

  def update_recipients(new_recipients)
    recipients = new_recipients - classroom_unit.assigned_student_ids
    make_request(recipients)
  end

  private

  def make_request(recipients)
    if can_post_to_google_classroom?
      handle_response { request(recipients) }
    end
  end

  def request(recipient_ids)
    client.execute(
      api_method: api_method,
      parameters: {
        courseId: google_course_id,
      },
      body: body(recipient_ids).to_json,
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

  def body(recipient_ids)
    if individual_students?
      base_body.merge(individual_students_body(recipient_ids))
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

  def unit
    classroom_unit.unit
  end

  def user
    classroom.owner
  end

  def google_course_id
    classroom.google_classroom_id
  end

  def announcement_text
    unit_url = classroom_url(classroom.id, anchor: unit.id)

    "New Unit: #{unit.name} #{unit_url}"
  end

  def individual_students?
    classroom_unit.assigned_student_ids.any? &&
    !classroom_unit.assign_on_join
  end

  def individual_students_body(recipient_ids)
    {
      assigneeMode: "INDIVIDUAL_STUDENTS",
      individualStudentsOptions: {
        studentIds: assigned_student_ids_as_google_ids(recipient_ids)
      }
    }
  end

  def assigned_student_ids_as_google_ids(assigned_student_ids)
    User.where(id: assigned_student_ids)
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
    classroom && classroom.google_classroom_id.present? && classroom.owner.post_google_classroom_assignments
  end
end
