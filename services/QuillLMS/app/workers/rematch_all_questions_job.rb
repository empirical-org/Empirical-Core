class RematchAllQuestionsJob
  include Sidekiq::Worker
  # Marking as critical, since this unblocks 1MM+ jobs in the CMS.
  sidekiq_options queue: SidekiqQueue::CRITICAL

  REMATCH_URL = "#{ENV['CMS_URL']}/responses/rematch_all"
  JSON_HEADERS = {'Content-Type' => 'application/json', 'Accept' => 'application/json'}

  def perform
    Question.live.select(:id, :uid, :question_type).find_each do |question|
      HTTParty.post(
        REMATCH_URL,
        body: {type: question.rematch_type, uid: question.uid}.to_json,
        headers: JSON_HEADERS
      )
    end
  end
end
