# frozen_string_literal: true

module GoogleIntegration::Classroom::Requesters::Students

  def self.generate(client)
    lambda do |course_id|
      students = []
      service = client.discovered_api('classroom', 'v1')
      api_method = service.courses.students.list
      make_google_classroom_api_call(course_id, api_method, client, students)
    end
  end

  def self.make_google_classroom_api_call(course_id, api_method, client, students, page_token=nil)
    # google classroom inconsistenly caps the students returned at 30
    # to get around this, we request 30 students, and then recursively
    # keep calling on the classroom with the updated page token until
    # there is not another page token
    # in each iteration, we concat the latest student response value
    # to an array of previous ones from within the course
    parameters = {'courseId' => course_id, 'pageSize'=> 30}
    page_token ? parameters['pageToken'] = page_token : nil
    response = client.execute(api_method: api_method,
                              parameters: parameters)
    students ||= []
    students.concat(JSON.parse(response.body)['students'] || [])
    if response.next_page_token
      return make_google_classroom_api_call(course_id, api_method, client, students, response.next_page_token)
    end

    students
  end
end
