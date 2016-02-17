module CleverIntegration::DistrictSignUp::Setup

  def self.run(auth_hash)
    token = auth_hash[:credentials][:token]
    district = District.where(clever_id: auth_hash[:info][:id]).first_or_initialize
    district.update_attributes(name: auth_hash[:info][:name], token: token)
    self.setup_schools!(district, token) if district.new_record?
    district
  end

  private

  def self.setup_schools(district, token)
    clever_district = self.get_clever_district(district, token)

    clever_district.schools.each do |school|
      next unless school.nces_id
      s = School.where(nces_id: school.nces_id).first_or_initialize
      s.update_attributes(clever_id: s.id)
    end
  end

  def self.clever_district(district, token)
    result = Clever::District.retrieve(district.clever_id, token)
    result
  end


  # used NOT when a district is signing up
  # def self.create_from_clever(id, token)
  #   district = ::District.where(clever_id: id).first_or_initialize
  #   district.update_attributes(name: district.clever_district(token).name)
  #   district.import_from_clever!(token) if district.new_record?
  #   district
  # end
end