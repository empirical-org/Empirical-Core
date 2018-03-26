desc "Trigger segment events for automatic sales events"
task :trigger_auto_sales_events => :environment do
  User.joins(:school).where('users.role = ?', 'teacher').find_each do |teacher|
    SalesContactUpdater.new(teacher.id, '1').update
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
        SalesContactUpdater.new(teacher.id, '2').update
      end

      if school_premuim.include? teacher.subscription.account_type
        SalesContactUpdater.new(teacher.id, '6.1')
    end
  end
end
