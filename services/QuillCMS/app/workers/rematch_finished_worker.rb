class RematchFinishedWorker
  include Sidekiq::Worker

  sidekiq_options queue: SidekiqQueue::DEFAULT

  def perform(question_key)
    RematchingFinished.run(question_key)
  end

end
