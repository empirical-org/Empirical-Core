require 'json'
require 'net/http'

class RematchResponseWorker
  include Sidekiq::Worker

  def perform(response_id, question_type, question, reference_responses)
    response = Response.find_by(id: response_id)
    lambda_payload = construct_lambda_payload(response, question_type, question, reference_responses)
    updated_response = call_lambda_http_endpoint(lambda_payload)
    response.update_attributes(updated_response)
    response.save
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
    # "https://p8147zy7qj.execute-api.us-east-1.amazonaws.com/prod"
    url = URI.parse(ENV['REMATCH_LAMBDA_URL'])
    req = Net::HTTP::Post.new(url.to_s, {'Content-Type' => 'application/json'}
    req.body = lambda_payload.to_json
    res = Net::HTTP.start(url.host, url, port) { |http|
      http.request(req)
    }
    JSON.parse(res.body)
  end

end
