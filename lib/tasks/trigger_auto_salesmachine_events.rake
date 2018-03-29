desc "Trigger segment events for automatic sales events"
task :trigger_auto_sales_events => :environment do
  User.joins(:school).where('users.role = ?', 'teacher').find_each do |teacher|
    SalesContactUpdaterWorker.perform_async(teacher.id, '1')
  end

  User.joins(:school, :subscription)
    .where('users.role = ?', 'teacher')
    .find_each do |teacher|

      teacher_premuim = [
        'Teacher Paid',
        'Premium Credit',
        'paid',
      ]

      school_premuim  = [
        'School NYC Paid',
        'School Strategic Paid',
        'School Paid',
        'Purchase Missing School',
        'school',
        'School',
      ]

      if teacher_premuim.include? teacher.subscription.account_type
        SalesContactUpdaterWorker.perform_async(teacher.id, '2')
      end

      if school_premuim.include? teacher.subscription.account_type
        SalesContactUpdaterWorker.perform_async(teacher.id, '6.1')
    end
  end
end
