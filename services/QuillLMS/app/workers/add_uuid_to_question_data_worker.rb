# frozen_string_literal: true

class AddUuidToQuestionDataWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(type, offset, batch_size)
    questions = Question.where("jsonb_typeof(data->'#{type}') = 'array'")
    .offset(offset)
    .limit(batch_size)

    questions.each do |question|
      # We don't need to refresh the cache for questions as the uid will not be used by the front end yet.
      question.skip_refresh_caches = true
      question.save_uids_for(type)
    end
  end
end
