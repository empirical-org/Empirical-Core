class AmplifyReportActivityWorker
  include Sidekiq::Worker

  def perform(amplify_session_id, activity_name, score, results_url, description)
    @payload = generate_payload(amplify_session_id, activity_name, score, results_url, description)
    submit_payload_to_amplify(@payload)
  end

  def generate_payload(amplify_session_id, activity_name, score, results_url, description)
    return {
      "amplify_session_id" => amplify_session_id,
      "activity_name" => activity_name,
      "score" => score,
      "results_url" => results_url,
      "activity_description" => description
    }
  end

  def submit_payload_to_amplify(payload)
    # Do some sort of HTTP request here instead of logging
    logger.debug(payload)
  end

end
