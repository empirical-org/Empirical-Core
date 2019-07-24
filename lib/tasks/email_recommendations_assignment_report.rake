namespace :recommendation_assignments_report do
  desc 'email dev team recommendations assignment report'
  task :email => :environment do
    UserMailer.recommendations_assignment_report_email.deliver_now!
  end
end
