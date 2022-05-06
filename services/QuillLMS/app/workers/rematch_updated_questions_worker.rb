# frozen_string_literal: true

class RematchUpdatedQuestionsWorker
  include Sidekiq::Worker
  # Marking as critical, since this unblocks 1MM+ jobs in the CMS.
  sidekiq_options queue: SidekiqQueue::CRITICAL, retry: false

  REMATCH_URL = "#{ENV['CMS_URL']}/responses/rematch_all"
  JSON_HEADERS = {'Content-Type' => 'application/json', 'Accept' => 'application/json'}
  DELAY_PER_QUESTION = 1.minutes.to_i

  def perform(start_time = 1.day.ago, end_time = Time.current, delay =  DELAY_PER_QUESTION)
    questions = Question
      .production
      .where(updated_at: start_time..end_time)
      .select(:id, :uid, :question_type)

    questions.find_each.with_index do |question, index|

      body = {
        type: question.rematch_type,
        uid: question.uid,
        delay: index * delay
      }

      HTTParty.post(REMATCH_URL, body: body.to_json, headers: JSON_HEADERS)
    end
  end
end
