require 'json'
require 'net/http'

class RematchResponsesForQuestionWorker
  include Sidekiq::Worker
  sidekiq_options retry: 3, queue: SidekiqQueue::LOW

  def perform(question_uid, question_type)
    human_graded_ids = human_graded_response_ids(question_uid)
    ungraded = ungraded_responses(question_uid)
    machine_graded = machine_graded_responses(question_uid)

    question_hash = retrieve_question(question_uid)

    schedule_jobs(ungraded, question_type, question_hash, human_graded_ids)
    schedule_jobs(machine_graded, question_type, question_hash, human_graded_ids)
  end

  def schedule_jobs(finder, question_type, question_hash, human_graded_response_ids)
    # use find_each these in batches
    finder.find_each do |response|
      RematchResponseWorker.perform_async(
        response.id,
        question_type,
        question_hash,
        human_graded_response_ids
      )
    end
  end

  def ungraded_responses(question_uid)
    Response.where(question_uid: question_uid)
            .where(parent_id: nil)
            .where(parent_uid: nil)
            .where(optimal: nil)
            .select(:id)
  end

  def machine_graded_responses(question_uid)
    Response.where(question_uid: question_uid)
            .where("responses.parent_id IS NOT NULL OR responses.parent_uid IS NOT NULL")
            .select(:id)
  end

  def human_graded_response_ids(question_uid)
    Response.where(question_uid: question_uid)
            .where.not(optimal: nil)
            .where(parent_id: nil)
            .pluck(:id)
  end

  def retrieve_question(question_uid)
    response = HTTParty.get("#{ENV['LMS_URL']}/api/v1/questions/#{question_uid}.json")

    raise if response.code != 200

    response[:key] = question_uid
    response.stringify_keys
  end
end
