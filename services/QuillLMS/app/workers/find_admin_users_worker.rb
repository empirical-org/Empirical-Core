# frozen_string_literal: true

class FindAdminUsersWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  SERIALIZED_ADMIN_USERS_CACHE_LIFE = 25.hours

  def perform(admin_id)
    user = User.find_by_id(admin_id)
    return unless user

    serialized_admin_users = UserAdminSerializer.new(user).to_json(root: false)

    Rails.cache.write(
      "#{SchoolsAdmins::ADMIN_USERS_CACHE_KEY_STEM}#{admin_id}",
      serialized_admin_users,
      expires_in: SERIALIZED_ADMIN_USERS_CACHE_LIFE
    )

    PusherAdminUsersCompleted.run(admin_id)
  end
end
