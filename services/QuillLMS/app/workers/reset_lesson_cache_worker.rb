# frozen_string_literal: true

class ResetLessonCacheWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  class UserNotFoundError < StandardError; end

  def perform(user_id)
    return if user_id.nil?

    $redis.del("user_id:#{user_id}_lessons_array")
    user = User.find_by(id: user_id)

    return ErrorNotifier.report(UserNotFoundError, user_id: user_id) if user.nil?

    user.set_lessons_cache
  end
end
