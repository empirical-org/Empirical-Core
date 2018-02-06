desc 'updates recurring subscriptions after charging appropriate stripe user'
task update_recurring_subscriptions: :environment do
  generate_fullnames
end
