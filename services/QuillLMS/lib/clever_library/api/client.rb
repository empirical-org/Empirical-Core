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

  def get_path(path:)
    self.class.get(path, @options).parsed_response["data"]
  end

  def get_district(district_id:)
    self.class.get('/districts/' + district_id, @options).parsed_response["data"]
  end

  def user
    self.class.get('/me', @options).parsed_response["data"]
  end

  def get_teacher(teacher_id:)
    self.class.get('/teachers/' + teacher_id, @options).parsed_response["data"]
  end

  def get_teacher_sections(teacher_id:)
    self.class.get('/teachers/' + teacher_id + '/sections', @options)
      .parsed_response["data"]
      .map {|section| section["data"]}
  end

  def get_school_admin(school_admin_id:)
    self.class.get('/school_admins/' + school_admin_id, @options).parsed_response["data"]
  end

  def get_school_admin_schools(school_admin_id:)
    self.class.get('/school_admins/' + school_admin_id + '/schools', @options)
      .parsed_response["data"]
      .map {|school| school["data"]}
  end

  def get_section_students(section_id:)
    data = self.class.get('/sections/' + section_id + '/students', @options)
      .parsed_response["data"]
    if data && data.length
      data.map {|section| section["data"]}
    else
      nil
    end
  end
end
