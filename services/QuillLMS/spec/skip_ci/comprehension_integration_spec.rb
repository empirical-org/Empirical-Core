require 'csv'
require 'httparty'

# This file is excluded from Rspec test auto-discovery, so won't be run
# by default.  If you do want to run this test, you'll need to specify
# it directly:
# `bundle exec rspec spec/skip_ci/comprehension_integration_spec.rb`
describe 'ComprehensionIntegration' do
  FEEDBACK_URL = 'https://comprehension-feedback.quill.org'
  SESSION_ID = 'INTEGRATION_TEST'

  # CSV generated via the following Metabase query
  # http://data.quill.org/question/655?comprehension_activity_id=87
  csv = CSV.open("#{__dir__}/comprehension_integration_samples.csv", headers: true)
  csv.each do |row|
    it "Should match record for prompt #{row['prompt_id']} entry: '#{row['entry']}'" do
      response = HTTParty.post(FEEDBACK_URL,
        headers: {'Content-Type': 'application/json'},
        body: {
          session_id: SESSION_ID,
          prompt_id: row['prompt_id'].to_i,
          prompt_text: row['stem'],
          entry: row['entry'],
          attempt: 1,
          previous_feedback: [],
        }.to_json
      )
      RSpec::Support::ObjectFormatter.default_instance.max_formatted_output_length = 10000

      expect(response.code).to be(200)

      json_response = JSON.parse(response.body)

      expect(json_response['optimal'].to_s).to eq(row['optimal'])
      expect(json_response['feedback_type']).to eq(row['rule_type'])
      expect(json_response['rule_uid']).to eq(row['rule_uid'])
      expect(json_response['concept_uid']).to eq(row['concept_uid'])
    end
  end
end
