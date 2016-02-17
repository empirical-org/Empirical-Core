module CleverIntegration::District::Main


  def self.find_or_create_and_import_schools(clever_id, token, name)
    district = self.find_or_create(clever_id, token, name)
    self.setup_schools(district)
  end

  private

  def self.find_or_create(clever_id, token, name)
    district = District.where(clever_id: clever_id).first_or_initialize
    district.update_attributes(name: name, token: token)
    district.reload
  end


  def self.setup_schools(district)
    clever_district = self.get_clever_district(district)

    clever_district.schools.each do |school|
      next unless school.nces_id
      s = School.where(nces_id: school.nces_id).first_or_initialize
      s.update_attributes(clever_id: s.id)
    end
  end

  def self.get_clever_district(district)
    result = Clever::District.retrieve(district.clever_id, district.token)
    result
  end

end