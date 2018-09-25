namespace :referrals do
  desc 'activate referrals'
  task activate: :environment do
    ReferralsUser.ids_due_for_activation.each do |id|
      referred_user = ReferralsUser.find(id)
      referred_user.update(activated: true)
      referring_user = referred_user.user
      referring_user.credit_transactions << CreditTransaction.new(
        amount: 28,
        source: referred_user
      )
    end
  end
end
