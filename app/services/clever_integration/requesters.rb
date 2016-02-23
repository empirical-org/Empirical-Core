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

  def helper(klass)
    lambda do |clever_id, district_token|
      Clever::klass.retrieve(clever_id, district_token)
    end
  end

end