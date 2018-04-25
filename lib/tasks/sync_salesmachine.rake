desc "Sync teacher and school attributes with salesmachine"
task :sync_salesmachine => :environment do
  ACCOUNTS_KEY    = 'Salesmachine::AccountIDs'
  CONTACTS_KEY    = 'Salesmachine::ContactIDs'
  SALES_STAGE_KEY = 'Salesmachine::SalesStageContactIDs'

  $redis.del(ACCOUNTS_KEY)
  $redis.del(CONTACTS_KEY)
  $redis.del(SALES_STAGE_KEY)

  School.distinct.joins(:users).where('users.role = ?', 'teacher').find_each do |school|
    puts school.id
    $redis.lpush(ACCOUNTS_KEY, school.id)
  end

  User.joins(:school).where('users.role = ?', 'teacher').find_each do |teacher|
    puts teacher.id
    $redis.lpush(CONTACTS_KEY, teacher.id)
    $redis.lpush(SALES_STAGE_KEY, teacher.id)
  end

  SyncSalesAccountsWorker.perform_async(ACCOUNTS_KEY)
  SyncSalesContactsWorker.perform_async(CONTACTS_KEY)
  SyncSalesStageWorker.perform_async(SALES_STAGE_KEY)
end
