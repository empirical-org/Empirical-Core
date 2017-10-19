desc "This task is called by the Heroku scheduler add-on"
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
