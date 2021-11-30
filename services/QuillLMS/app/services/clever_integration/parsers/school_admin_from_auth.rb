# frozen_string_literal: true

module CleverIntegration::Parsers::SchoolAdminFromAuth

  def self.run(auth_hash)
    info = auth_hash[:info]
    district_id = info[:district]
    district = CleverIntegration::Importers::CleverDistrict.run(district_id: district_id)
    school_admin = CleverIntegration::Requesters.school_admin(info[:id], district.token)
    {
      clever_id: info[:id],
      email: school_admin.data.email.downcase,
      name: "#{school_admin.data.name.first} #{school_admin.data.name.last}",
      district_id: district_id
    }
  end
end
