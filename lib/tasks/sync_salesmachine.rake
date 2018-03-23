desc "Sync teacher and school attributes with salesmachine"
task :sync_salesmachine => :environment do
  ACCOUNTS_KEY = 'Salesmachine::AccountIDs'

  $redis.del(ACCOUNTS_KEY)

  School.distinct.joins(:users).where('users.role = ?', 'teacher')
    .find_each do |school|
      puts school.id
      $redis.lpush(ACCOUNTS_KEY, school.id)
    end

  SyncSalesAccountWorker.perform_async(ACCOUNTS_KEY)


  CONTACTS_KEY = 'Salesmachine::ContactIDs'

  $redis.del(CONTACTS_KEY)

  User.joins(:school).where('users.role = ?', 'teacher').find_each do |teacher|
    puts teacher.id
    $redis.lpush(CONTACTS_KEY, teacher.id)
  end

  SyncSalesContactWorker.perform_async(CONTACTS_KEY)
end
