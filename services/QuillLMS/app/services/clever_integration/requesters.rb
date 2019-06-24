module CleverIntegration::Requesters

  def self.teacher
    self.helper('Teacher')
  end

  def self.section
    self.helper('Section')
  end

  def self.district
    self.helper('District')
  end

  def self.school_admin
    self.helper('SchoolAdmin')
  end

  private

  def self.helper(resource_kind)
    lambda do |clever_id, district_token|
      klass = "Clever::#{resource_kind}".constantize
      klass.retrieve(clever_id, district_token)
    end
  end

end
