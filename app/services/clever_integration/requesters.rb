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

  private

  def self.helper(resource_kind)
    lambda do |clever_id, district_token|
      klass = "Clever::#{resource_kind.capitalize}".constantize
      klass.retrieve(clever_id, district_token)
    end
  end

end