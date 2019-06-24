module CleverIntegration::Requesters

  def self.teacher
    self.helper('teacher')
  end

  def self.section
    self.helper('section')
  end

  def self.district
    self.helper('district')
  end

  def self.school_admin
    self.helper('school_admin')
  end

  def self.school
    self.helper('school')
  end

  def self.sections_for_teacher
    self.helper('sections_for_teacher')
  end

  def self.schools_for_school_admin
    self.helper('schools_for_school_admin')
  end

  private

  def self.helper(resource_kind)
    lambda do |clever_id, district_token|

      Clever.configure do |config|
        # Configure OAuth2 access token for authorization: oauth
        config.access_token = district_token
      end

      api_instance = Clever::DataApi.new
      case resource_kind
      when 'teacher'
        api_instance.get_teacher(clever_id)
      when 'section'
        api_instance.get_section(clever_id)
      when 'district'
        api_instance.get_district(clever_id)
      when 'school_admin'
        api_instance.get_school_admin(clever_id)
      when 'school'
        api_instance.get_school(clever_id)
      when 'sections_for_teacher'
        api_instance.get_sections_for_teacher(clever_id)
      when 'schools_for_school_admin'
        api_instance.get_schools_for_school_admin(clever_id)
      end
    end
  end

end
