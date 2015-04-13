class District < ActiveRecord::Base
  has_and_belongs_to_many :users

  def self.setup_from_clever(auth_hash)
    district = ::District.where(clever_id: auth_hash[:info][:id]).first_or_initialize
    district.import_from_clever! if district.new_record?
    district.update_attributes(name: auth_hash[:info][:name], token: auth_hash[:credentials][:token])
    district
  end

  def self.create_from_clever(id)
    district = ::District.where(clever_id: id).first_or_initialize
    district.import_from_clever! if district.new_record?
    district.update_attributes(name: district.clever_district_name)
    district
  end

  def import_from_clever!
    clever_district.schools.each do |school|
      next unless school.nces_id

      s = School.where(nces_id: school.nces_id).first_or_initialize
      s.update_attributes(
        clever_id: s.id
      )
    end
  end

  def clever_district_name
    clever_district.name
  end

  private

  def clever_district
    @clever_district ||= Clever::District.retrieve(self.clever_id)
  end

end
