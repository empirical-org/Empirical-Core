require 'json'
require 'net/http'

class RematchResponsesForQuestionWorker
  include Sidekiq::Worker

  def perform(question_uid, question_type)
    # If we don't have any human graded responses to use as references
    # then there's no point in algorithmically processing them because
    # all of our current algorithms require human graded responses to
    # use as references.
    reference_responses = get_human_graded_responses(question_uid).to_a
    if reference_responses.length
      question = retrieve_question_from_firebase(question_uid, question_type)
      responses_to_reprocess = get_ungraded_responses + get_machine_graded_responses
      responses_to_reprocess.each do |response|
        enqueue_individual_response(response.id, question_type, question, reference_responses)
      end
    end
  end

  def enqueue_individual_response(response_id, question_type, question, reference_responses)
    return [
      response_id,
      question_type,
      question,
      reference_responses
    ]
    #RematchResponse.perform_async(response_id, question_type, question, reference_responses)
  end

  def get_human_graded_responses(question_uid)
    Response.where(question_uid: question_uid)
            .where.not(optimal: nil)
            .where(parent_id: nil)
  end

  def get_ungraded_responses(question_uid)
    Response.where(question_uid: question_uid)
            .where(parent_id: nil)
            .where(parent_uid: nil)
            .where(optimal: nil)
  end

  def get_machine_graded_responses(question_uid)
    Response.where(question_uid: question_uid)
            .where("responses.parent_id IS NOT NULL OR responses.parent_uid IS NOT NULL")
  end

  def retrieve_question_from_firebase(question_uid, question_type)
    url = URI.parse(get_firebase_url(question_type))
    req = Net::HTTP::Get.new(url.to_s)
    res = Net::HTTP.start(url.host, url, port) { |http|
      http.request(req)
    }
    JSON.parse res.body
  end

  def get_firebase_url(question_type)
    if (question_type == 'grammar_questions')
      return "#{ENV['FIREBASE_URL']/v3/questions/${question_uid}.json"
    else
      return "#{ENV['FIREBASE_URL']/v2/#{question_type}/${question_uid}.json"
    end
  end
end
