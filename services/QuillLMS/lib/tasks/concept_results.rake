# frozen_string_literal: true

namespace :concept_results do
  desc 'Take pipe of CSV with cURL payloads from Sentry for failed ConceptResult saves'
  task save_from_curl_payloads: :environment do
    pipe_data = $stdin.read unless $stdin.tty?

    unless pipe_data
      puts 'No data detected on STDIN.  You must pass data to the task for it to run.  Example:'
      puts '  rake concept_results:save_from_curl_payloads < path/to/local/file.csv'
      puts ''
      puts 'If you are piping data into Heroku, you need to include the --no-tty flag:'
      puts '  heroku run rake concept_results:save_from_curl_payloads -a empirical-grammar --no-tty < path/to/local/file.csv'
      exit 1
    end

    CSV.parse(pipe_data) do |row|
      concept_result_payload = row[0]
      post_url = row[1]

      payload_pattern = /--data (.*}" )/
      url_pattern = /\/([\d\w_-]+)"/
      concept_results = JSON.parse(payload_pattern.match(concept_result_payload)[1])['concept_results']
      activity_session_uid = url_pattern.match(post_url)[1]
      puts "'#{activity_session_uid}',"
      activity_session_id = ActivitySession.find_by_uid(activity_session_uid).id
      concept_results.each do |cr|
        concept_id = Concept.find_by_uid(cr['concept_uid']).id
        cr.merge({"concept_id" => concept_id, "activity_session_id" => activity_session_id})
        SaveActivitySessionConceptResultsWorker.perform_async(cr)
      end

    rescue => e
      #puts "Failed to parse row: #{e} - #{row[1]}"
    end
  end

  desc 'Clear the Sidekiq queue of jobs attempting to save ConceptResults, but missing activity_session_id (which will cause the job to error)'
  # Based on example code from the Sidekiq docs: https://github.com/mperham/sidekiq/wiki/API#retries
  task clear_bad_job_payloads: :environment do
    query = Sidekiq::RetrySet.new
    query.select do |job|
      job.klass == 'SaveActivitySessionConceptResultsWorker' &&
      job.args[0]['activity_session_id'].nil?
    end.map(&:delete)
  end
end
