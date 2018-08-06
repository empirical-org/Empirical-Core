desc "Trigger segment events for automatic sales events"
task :trigger_auto_sales_events => :environment do
  User.joins(:school).where('users.role = ?', 'teacher').find_each do |teacher|
    UpdateSalesContactWorker.perform_async(teacher.id, '1')
  end


  Subscription.joins(:purchaser).find_each do |subscription|

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

    if teacher_premuim.include? subscription.account_type
      UpdateSalesContactWorker.perform_async(subscription.purchaser_id, '2')
    end

    if school_premuim.include? subscription.account_type
      UpdateSalesContactWorker.perform_async(subscription.purchaser_id, '6.1')
    end
  end
end
