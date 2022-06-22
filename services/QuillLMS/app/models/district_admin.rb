# frozen_string_literal: true

# == Schema Information
#
# Table name: district_admins
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  district_id :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_district_admins_on_district_id  (district_id)
#  index_district_admins_on_user_id      (user_id)
#
class DistrictAdmin < ApplicationRecord
  belongs_to :district
  belongs_to :user
  validates :user_id, uniqueness: { scope: :district_id }

  after_create :attach_schools
  after_destroy :detach_schools

  def admin
    user
  end

  def attach_schools
    admin
      .schools_admins
      .create!(unattached_district_schools.map { |school| { school_id: school.id } } )
  end

  def detach_schools
    admin
      .schools_admins
      .where(school: district_schools)
      .destroy_all
  end

  private def unattached_district_schools
    district_schools - admin.reload.administered_schools
  end

  private def district_schools
    district.reload.schools
  end
end
