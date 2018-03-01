desc 'updates recurring subscriptions after charging appropriate stripe user'
task update_recurring_subscriptions: :environment do
  puts 'begin recurring subscription update'
  Subscription.update_todays_expired_recurring_subscriptions
  puts 'finish recurring subscription update'
end
