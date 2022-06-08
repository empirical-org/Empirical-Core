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

  after_create :attach_to_subscribed_schools
  after_destroy :detach_from_schools

  def admin
    user
  end

  def attach_to_subscribed_schools
    current_schools = admin.administered_schools

    schools_with_subscriptions.each do |school|
      NewAdminEmailWorker.perform_async(admin.id, school.id) if !current_schools.include?(school)
    end

    admin.administered_schools += schools_with_subscriptions
    admin.save
  end

  def detach_from_schools
    schools_with_subscriptions.each do |school|
      SchoolsAdmins.where(school: school, user: admin).destroy_all
    end
  end

  def schools_with_subscriptions
    district.schools.filter { |school| school.subscription.present? }
  end
end
