# frozen_string_literal: true


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
    schools.filter{ |s| s.subscription.present?}
  end
end
