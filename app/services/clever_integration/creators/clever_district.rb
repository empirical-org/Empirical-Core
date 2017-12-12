module CleverIntegration::Creators::CleverDistrict

  def self.run(hash)
    district = District.find_or_initialize_by(clever_id: hash[:clever_id])
    district.update(name: hash[:name], token: hash[:token])
    district.reload
  end

end
