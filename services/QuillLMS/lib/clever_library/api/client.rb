class CleverLibrary::Api::Client
  include HTTParty
  base_uri 'https://api.clever.com/v2.0'

  def initialize(bearer_token)
    @options = {
      headers: {
        "Authorization": "Bearer " + bearer_token
      }
    }
  end

  def get_teacher(teacher_id:)
    self.class.get('/teachers/' + teacher_id, @options).parsed_response["data"]
  end

  def get_teacher_sections(teacher_id:)
    self.class.get('/teachers/' + teacher_id + '/sections', @options)
      .parsed_response["data"]
      .map {|section| section["data"]}
  end

  def get_section_students(section_id:)
    self.class.get('/sections/' + section_id + '/students', @options)
      .parsed_response["data"]
      .map {|section| section["data"]}
  end
end


