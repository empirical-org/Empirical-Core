require 'json'
require 'net/http'

MAX_RETRIES = 3

class RematchResponseWorker
  include Sidekiq::Worker

  def perform(response, question_type, question, reference_responses, retry_count=0)
    lambda_payload = construct_lambda_payload(response, question_type, question, reference_responses)
    updated_response = call_lambda_http_endpoint(lambda_payload)
    if updated_response["message"] == "Endpoint request timed out"
      if retry_count < MAX_RETRIES
        RematchResponseWorker.perform_async(response, question_type, question, reference_responses, retry_count+1)
      else
        raise "Retry limit exceeded for Response: #{response.id}"
      end
    else
      #response.update_attributes(updated_response)
    end
  end

  def construct_lambda_payload(response, question_type, question, reference_responses)
    {
      response: response,
      type: question_type,
      question: question,
      referenceResponses: reference_responses
    }
  end

  def call_lambda_http_endpoint(lambda_payload)
    resp = Net::HTTP.post URI(ENV['REMATCH_LAMBDA_URL']),
                          lambda_payload.to_json,
                          "Content-Type" => "application/json"
    JSON.parse(resp.body)
  end

end
