# frozen_string_literal: true

class ClearUserDataWorker
  include Sidekiq::Worker

  def perform(id)
    user = User.find(id)
    ActiveRecord::Base.transaction do
      user.update!(
        name:      "Deleted User_#{id}",
        email:     "deleted_user_#{id}@example.com",
        username:  "deleted_user_#{id}",
        google_id: nil,
        clever_id: nil,
        ip_address: nil,
        send_newsletter: false
      )
      StudentsClassrooms.where(student_id: id).destroy_all
      user.auth_credential.destroy! if user.auth_credential.present?
      user.ip_location.destroy! if user.ip_location.present?
      SchoolsUsers.where(user_id: id).destroy_all
      ClassroomUnit.where("? = ANY (assigned_student_ids)", id).each {|cu| cu.update(assigned_student_ids: cu.assigned_student_ids - [id])}
      ActivitySession.where(user_id: id).update_all(user_id: nil, classroom_unit_id: nil)

      user.subscriptions.each do |subscription|
        subscription.update!(recurring: false)
        subscription.stripe_cancel_at_period_end
      end
    end
  end
end
