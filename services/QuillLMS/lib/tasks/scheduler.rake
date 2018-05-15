desc "These tasks are called by the Heroku scheduler add-on"
task :scheduled_reset_demo => :environment do
    puts 'resetting demo'
    puts 'clearing demo'
    Demo::ReportDemoDestroyer::destroy_demo(nil)
    puts 'demo cleared'
    puts 'creating demo'
    Demo::ReportDemoCreator::create_demo(nil)
    puts 'demo created'
    puts 'demo reset completed'
end

task :update_todays_expired_recurring_subscriptions => :environment do
    puts "about to update todays expired recurring subscriptions"
    puts "resetting todays expired subscriptions"
    Subscription.update_todays_expired_recurring_subscriptions
    puts 'expired recurring subscriptions have been updated'
    puts 'update_todays_expired_recurring_subscriptions'
end
