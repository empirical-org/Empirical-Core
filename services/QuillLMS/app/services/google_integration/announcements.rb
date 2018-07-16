require 'google/api_client'

class GoogleIntegration::Announcements
  include Rails.application.routes.url_helpers
  attr_reader :unit, :classroom_unit

  def self.post_unit(unit)
    classroom_units = unit.classroom_units
      # we may just be able to skip this part?
      # .group_by { |classroom_unit| classroom_unit.activity_id }
      # .values
      # .first

    classroom_units.each do |classroom_unit|
      # this method lives in classroom unit now, will need refactor
      if classroom_unit.is_valid_for_google_announcement_with_owner?
        # owner = classroom_unit.classroom.owner
        new(classroom_unit, unit).post
      end
    end
  end

  def initialize(unit_activity, unit=nil)
    @unit_activity = unit_activity
    @unit = unit
  end

  def post
    handle_response { request }
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
    if classroom_unit.assigned_student_ids.any? && !classroom_unit.assign_on_join
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
    if @unit.present?
      unit_url = classroom_url(classroom.id, anchor: unit.id)

      "New Unit: #{@unit.name} #{unit_url}"
    else
      activity_url  = @unit_activity.generate_activity_url
      activity_name = @unit_activity.activity.name

      "New Activity: #{activity_name} #{activity_url}"
    end
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
end
