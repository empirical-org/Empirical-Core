# frozen_string_literal: true

# == Schema Information
#
# Table name: districts_admins
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  district_id :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_districts_admins_on_district_id  (district_id)
#  index_districts_admins_on_user_id      (user_id)
#
class DistrictsAdmins < ApplicationRecord
  belongs_to :district
  belongs_to :user

  after_create :attach_to_subscribed_schools
  after_destroy :detach_from_schools

  def admin
    user
  end

  def attach_to_subscribed_schools
    staff_user = User.find(user_id)&.email&.match('quill.org')
    return unless staff_user

    district = District.find(district_id)
    schools_with_subscriptions.each do |school|
      school_admin = SchoolsAdmins.find_or_create_by(school: school, user: admin)
      NewAdminEmailWorker.perform_async(user_id, school.id)
    end
  end

  def detach_from_schools
    schools_with_subscriptions.each do |school|
      school_admin = SchoolsAdmins.find_by(school: school, user: admin)
      school_admin&.destroy
    end
  end

  def schools_with_subscriptions
    district.schools.filter{ |s| s.subscription.present?}
  end
end
