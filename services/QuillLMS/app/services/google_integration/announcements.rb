require 'google/api_client'

class GoogleIntegration::Announcements

  def self.post_unit_to_valid_classrooms(unit)
    classroom_activities_sample = unit.classroom_activities.group_by{|ca| ca.activity_id}.values.first
    binding.pry
    classroom_activities_sample.each do |ca|
      if ca.is_valid_for_google_announcement_with_owner?
        owner = ca.classroom.owner
        GoogleIntegration::RefreshAccessToken.new(owner).refresh
        new(owner.auth_credential.access_token, ca, ca.classroom.google_classroom_id, unit.name).post
      end
    end
  end

  def initialize(access_token, classroom_activity, google_course_id, unit_name=nil )
    @access_token = access_token
    @classroom_activity = classroom_activity
    @google_course_id = google_course_id
    @unit_name = unit_name
  end

  def post
    # As of May 23, 2018, the error responses provided by Google's server to malformed requests were not accurate
    # if you change this call and are struggling with the body,
    # make sure you try out the API call with https://developers.google.com/classroom/reference/rest/v1/courses.announcements/create
    # to validate that you are using the right one
    handle_response { request }
  end

  private

  def request
    client.execute(
      api_method: service.courses.announcements.create,
      parameters: {
        courseId: @google_course_id,
      },
      body: body.to_json,
      headers: {"Content-Type": 'application/json'}
    )
  end

  def handle_response(&request)
    response = JSON.parse(request.call.body, symbolize_names: true)
    if response.dig(:error, :status) == 'UNAUTHENTICATED'
      # TODO: pass back any other errors and we can handle them on the front end
      'UNAUTHENTICATED'
    else
      response
    end
  end

  def body
    if @classroom_activity.assigned_student_ids.any? && !@classroom_activity.assign_on_join
      base_body.merge(individual_students_body)
    else
      base_body
    end
  end

  def base_body
    if @unit_name
      text = "New Unit: #{@unit_name} #{ENV["DEFAULT_URL"]}"
    else
      text = "#{@classroom_activity.activity.name}: #{@classroom_activity.generate_activity_url}"
    end
    {
      text: text
    }
  end

  def individual_students_body
    {
      assigneeMode: "INDIVIDUAL_STUDENTS",
      individualStudentsOptions: {
        studentIds:assigned_student_ids_as_google_ids
      }
    }
  end

  def assigned_student_ids_as_google_ids
    User.where(id: @classroom_activity.assigned_student_ids).pluck(:google_id).compact
  end

  def service
    client.discovered_api('classroom', 'v1')
  end

  def client
    GoogleIntegration::Client.create(@access_token)
  end
end
