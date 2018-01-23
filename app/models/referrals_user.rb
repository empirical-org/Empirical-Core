class ReferralsUser < ActiveRecord::Base
  belongs_to :user
  has_one :referred_user, class_name: 'User', foreign_key: :id, primary_key: :referred_user_id

  after_create :trigger_invited_event
  after_save :trigger_activated_event, if: Proc.new { self.activated_changed? && self.activated }

  def referring_user
    self.user
  end

  def referrer
    self.user
  end

  def referral
    self.referred_user
  end

  private
  def trigger_invited_event
    # Unlike other analytics events, we want to track this event with respect
    # to the referrer, not the current user, because we are attempting to
    # measure the referrer's referring activity and not the current user's.
    ReferrerAnalytics.new.track_referral_invited(self.referrer, self.referred_user.id)
  end

  def trigger_activated_event
    # Unlike other analytics events, we want to track this event with respect
    # to the referrer, not the current user, because we are attempting to
    # measure the referrer's referring activity and not the current user's.
    ReferrerAnalytics.new.track_referral_activated(self.referrer, self.referred_user.id)
    UserMilestone.find_or_create_by(user_id: self.referrer.id, milestone_id: Milestone.find_or_create_by(name: Milestone::TYPES[:refer_an_active_teacher]).id)
  end
end
