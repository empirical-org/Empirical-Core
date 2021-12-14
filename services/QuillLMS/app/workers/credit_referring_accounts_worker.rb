# frozen_string_literal: true

class CreditReferringAccountsWorker
  include Sidekiq::Worker

  def perform
    find_qualifying_uncredited_referring_users.each do |id|
      provide_referral_credit_to_user(id)
    end
  end

  def find_qualifying_uncredited_referring_users
    ReferralsUser.ids_due_for_activation
  end

  def provide_referral_credit_to_user(user_id)
    referred_user = ReferralsUser.find(user_id)
    referred_user.update!(activated: true)
    referring_user = referred_user.user
    referring_user.credit_transactions << CreditTransaction.new(
      amount: 28,
      source: referred_user
    )
  end
end
