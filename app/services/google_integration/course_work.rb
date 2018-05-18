require 'google/api_client'

module GoogleIntegration::CourseWork

  def self.post(access_token, classroom_activity, google_course_id)
    client = GoogleIntegration::Client.create(access_token)
    service = client.discovered_api('classroom', 'v1')
    api_call = client.execute(api_method: service.courses.course_work.create, parameters: {courseId: google_course_id, fields: {title: hola}})
  end

end
