require 'google/api_client'

module GoogleIntegration::Announcements

  def self.post_announcement(access_token, classroom_activity, google_course_id)
    client = GoogleIntegration::Client.create(access_token)
    service = client.discovered_api('classroom', 'v1')
    # As of May 23, 2018, the error responses provided by Google's server to malformed requests were not accurate
    # if you change this call and are struggling with the body,
    # make sure you try out the API call with https://developers.google.com/classroom/reference/rest/v1/courses.announcements/create
    # to validate that you are using the right one
    api_call = client.execute(api_method: service.courses.announcements.create,
      parameters: {
        courseId: google_course_id,
      },
      body: JSON.dump({:text => 'sample description'}),
      headers: {"Content-Type": 'application/json'}
    )
    api_call.body
  end

end
