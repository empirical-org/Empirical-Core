namespace :referrals do
  desc 'activate referrals'
  task activate: :environment do
    ReferralsUser.ids_due_for_activation.each do |id|
      ReferralsUser.find(id).update(activated: true)
    end
  end
end
