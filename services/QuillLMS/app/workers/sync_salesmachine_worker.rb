class SyncSalesmachineWorker
  include Sidekiq::Worker

  ACCOUNTS_KEY    = 'Salesmachine::AccountIDs'
  CONTACTS_KEY    = 'Salesmachine::ContactIDs'
  SALES_STAGE_KEY = 'Salesmachine::SalesStageContactIDs'

  def perform
    clear_redis_cache
    build_redis_cache

    SyncSalesAccountsWorker.perform_async(ACCOUNTS_KEY)
    SyncSalesContactsWorker.perform_async(CONTACTS_KEY)
    SyncSalesStagesWorker.perform_async(SALES_STAGE_KEY)
  end

  def clear_redis_cache
    $redis.del(ACCOUNTS_KEY)
    $redis.del(CONTACTS_KEY)
    $redis.del(SALES_STAGE_KEY)
  end

  def build_redis_cache
    School.distinct.joins(:users).where('users.role = ?', 'teacher').find_each do |school|
      $redis.lpush(ACCOUNTS_KEY, school.id)
    end

    User.joins(:school).where('users.role = ?', 'teacher').find_each do |teacher|
      $redis.lpush(CONTACTS_KEY, teacher.id)
      $redis.lpush(SALES_STAGE_KEY, teacher.id)
    end
  end
end

