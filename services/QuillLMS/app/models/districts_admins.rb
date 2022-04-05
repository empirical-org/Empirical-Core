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

  after_create :send_admin_email

  def admin
    user
  end

  def send_admin_email
    staff_user = User.find(user_id)&.email&.match('quill.org')
    return unless Rails.env.production? || staff_user

    district = District.find(district_id)
    schools_with_subscriptions.each do |school|
      NewAdminEmailWorker.perform_async(user_id, school.id)
    end
  end

  def schools_with_subscriptions
    district.schools.filter{ |s| s.subscription.present?}
  end
end
