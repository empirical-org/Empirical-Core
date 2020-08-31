class ResetLessonCacheWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(id)
    $redis.del("user_id:#{id}_lessons_array")
    @user = User.find(id)
    @user.set_lessons_cache
  end
end
