# frozen_string_literal: true

require 'csv'
require 'json'
require 'httparty'

# Not committed for security reasons
AUTH_TOKEN = '90078eddc9a644c8a23ce300b00149fd65c9d719c0b641d28efd0ef4689c4dbf'

ISSUE_IDS = [
  '3699449988',
  '3699449998',
  '3699450190'
]

def fetch_from_api(url)
  HTTParty.get(url,
    headers: {
      Authorization: "Bearer #{AUTH_TOKEN}"
    })
end

def uid_from_url(url)
  url.match(%r{/([^/]+)$})[1]
end

def fetch_issue_event_ids(issue_id)
  url = "https://sentry.io/api/0/issues/#{issue_id}/events/"
  result = fetch_from_api(url)
  json_result = JSON.parse(result.body)
  json_result.map { |r| r['id'] }
end

def fetch_event_payload(event_id)
  url = "https://sentry.io/api/0/projects/quillorg-5s/production/events/#{event_id}/"
  result = fetch_from_api(url)
  json_result = JSON.parse(result.body)
  data = json_result['entries'][2]['data']
  [uid_from_url(data['url']), data['data']['concept_results'].to_json]
end

CSV.open('concept_results_from_sentry_errors.csv', 'w') do |csv|
  csv << ['activity_session_uid', 'concept_results_json']
  ISSUE_IDS.each do |issue_id|
    fetch_issue_event_ids(issue_id).each do |event_id|
      csv << fetch_event_payload(event_id)
    end
  end
end
