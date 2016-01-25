class District < ActiveRecord::Base
  has_and_belongs_to_many :users

  def self.setup_from_clever(auth_hash)
    token = auth_hash[:credentials][:token]
    district = ::District.where(clever_id: auth_hash[:info][:id]).first_or_initialize
    district.update_attributes(name: auth_hash[:info][:name], token: token)
    district.import_from_clever!(token) if district.new_record?
    district
  end

  def self.create_from_clever(id, token)
    district = ::District.where(clever_id: id).first_or_initialize
    district.update_attributes(name: district.clever_district(token).name)
    district.import_from_clever!(token) if district.new_record?
    district
  end

  def import_from_clever!(token)
    clever_district(token).schools.each do |school|
      next unless school.nces_id

      s = School.where(nces_id: school.nces_id).first_or_initialize
      s.update_attributes(
        clever_id: s.id
      )
    end
  end

  def clever_district(token)
    @clever_district ||= Clever::District.retrieve(self.clever_id, token)
  end

end
