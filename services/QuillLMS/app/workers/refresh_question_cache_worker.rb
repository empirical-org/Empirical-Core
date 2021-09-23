class RefreshQuestionCacheWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(question_type, uid = nil)
    Question.all_questions_json_cached(question_type, refresh: true)

    return unless uid

    Question.question_json_cached(uid, refresh: true)
  end
end
