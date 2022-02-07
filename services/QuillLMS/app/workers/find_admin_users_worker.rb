# frozen_string_literal: true

class FindAdminUsersWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(admin_id)
    user = User.find_by_id(admin_id)
    return unless user

    serialized_admin_users_cache_life = 60*60*25
    serialized_admin_users = UserAdminSerializer.new(user, root: false).to_json
    $redis.set("SERIALIZED_ADMIN_USERS_FOR_#{admin_id}", serialized_admin_users)
    $redis.expire("SERIALIZED_ADMIN_USERS_FOR_#{admin_id}", serialized_admin_users_cache_life)
    PusherAdminUsersCompleted.run(admin_id)
  end
end
