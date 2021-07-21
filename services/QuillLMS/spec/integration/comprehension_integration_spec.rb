require 'csv'
require 'httparty'

describe 'ComprehensionIntegration' do
  FEEDBACK_URL = 'https://comprehension-feedback.quill.org'
  SESSION_ID = 'INTEGRATION_TEST'

  csv = CSV.open("#{__dir__}/comprehension_integration_samples.csv", headers: true)
  csv.each do |row|
    it "Should match record for entry: '#{row['entry']}'" do
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
      expect(json_response['rule_uid']).to eq(row['rule_uid'])
      expect(json_response['concept_uid']).to eq(row['concept_uid'])
    end
  end
end
