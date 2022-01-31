# frozen_string_literal: true

# == Schema Information
#
# Table name: referrals_users
#
#  id               :integer          not null, primary key
#  activated        :boolean          default(FALSE)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  referred_user_id :integer          not null
#  user_id          :integer          not null
#
# Indexes
#
#  index_referrals_users_on_activated         (activated)
#  index_referrals_users_on_referred_user_id  (referred_user_id) UNIQUE
#  index_referrals_users_on_user_id           (user_id)
#
class ReferralsUser < ApplicationRecord
  belongs_to :user
  has_one :referred_user, class_name: 'User', foreign_key: :id, primary_key: :referred_user_id

  after_create :trigger_invited_event
  after_save :trigger_activated_event, if: proc { saved_change_to_activated? && activated }

  def referring_user
    user
  end

  def referrer
    user
  end

  def referral
    referred_user
  end

  def referrer_id
    user_id
  end

  def referral_id
    referred_user_id
  end

  def send_activation_email
    user_info = RawSqlRunner.execute(
      <<-SQL
        SELECT
          name,
          email
        FROM users
        WHERE id = #{referrer_id}
          OR id = #{referral_id}
      SQL
    ).to_a

    referrer_hash = user_info.first
    referrer_match = referrer_hash['email'].match('quill.org')

    referral_hash = user_info.last
    referral_match = referral_hash['email'].match('quill.org')

    email_match = referrer_match && referral_match

    return if !Rails.env.production? && !email_match

    UserMailer.activated_referral_email(referrer_hash, referral_hash).deliver_now!
  end

  def self.ids_due_for_activation
    act_sess_ids = RawSqlRunner.execute(
      <<-SQL
        SELECT DISTINCT
          classroom_units.id as classroom_unit_id
        FROM referrals_users
        JOIN classrooms_teachers
          ON referrals_users.referred_user_id = classrooms_teachers.user_id
        JOIN classroom_units
          ON classrooms_teachers.classroom_id = classroom_units.classroom_id
        WHERE referrals_users.activated = false
      SQL
    ).to_a.map(&:values).flatten

    return [] if act_sess_ids.empty?

    classroom_unit_ids = RawSqlRunner.execute(
      <<-SQL
        SELECT classroom_unit_id
        FROM activity_sessions
        WHERE classroom_unit_id IN (#{act_sess_ids.join(',')})
          AND activity_sessions.completed_at IS NOT NULL
      SQL
    ).to_a.map(&:values).flatten

    return [] if classroom_unit_ids.empty?

    RawSqlRunner.execute(
      <<-SQL
        SELECT DISTINCT referrals_users.id
        FROM referrals_users
        JOIN classrooms_teachers
          ON referrals_users.referred_user_id = classrooms_teachers.user_id
        JOIN classroom_units
          ON classrooms_teachers.classroom_id = classroom_units.classroom_id
        WHERE classroom_units.id IN (#{classroom_unit_ids.join(',')})
      SQL
    ).to_a.map(&:values).flatten
  end

  private def trigger_invited_event
    # Unlike other analytics events, we want to track this event with respect
    # to the referrer, not the current user, because we are attempting to
    # measure the referrer's referring activity and not the current user's.
    ReferrerAnalytics.new.track_referral_invited(referrer, referred_user.id)
  end

  private def trigger_activated_event
    # Unlike other analytics events, we want to track this event with respect
    # to the referrer, not the current user, because we are attempting to
    # measure the referrer's referring activity and not the current user's.
    ReferrerAnalytics.new.track_referral_activated(referrer, referred_user.id)
    UserMilestone.find_or_create_by(user_id: referrer.id, milestone_id: Milestone.find_or_create_by(name: Milestone::TYPES[:refer_an_active_teacher]).id)
    ReferralEmailWorker.perform_async(id)
  end
end
