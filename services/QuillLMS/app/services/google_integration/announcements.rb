require 'google/api_client'

module GoogleIntegration::Announcements

  def self.post_announcement(access_token, classroom_activity, google_course_id)
    client = GoogleIntegration::Client.create(access_token)
    service = client.discovered_api('classroom', 'v1')
    name = classroom_activity.activity.name
    body = JSON.dump({
      text: "#{name}: #{classroom_activity.generate_activity_url}"
    })
    api_call = client.execute(api_method: service.courses.announcements.create,
      parameters: {
        courseId: google_course_id,
      },
      body: body,
      headers: {"Content-Type": 'application/json'}
    )
    json_api_response = JSON.parse(api_call.body, symbolize_names: true)
    if json_api_response.dig(:error, :status) == 'UNAUTHENTICATED'
      return 'UNAUTHENTICATED'
    else
      json_api_response
    end
  end

end
