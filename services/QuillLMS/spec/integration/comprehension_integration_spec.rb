require 'csv'
require 'httparty'

describe 'ComprehensionIntegration' do
  FEEDBACK_URL = 'https://comprehension-feedback.quill.org'
  SESSION_ID = 'INTEGRATION_TEST'

  # CSV generated via the following query
  # SELECT prompt_id, c_p.text AS stem, entry, f_h.optimal, c_r.rule_type, rule_uid, f_h.concept_uid
  #     FROM feedback_histories AS f_h
  #     JOIN comprehension_prompts AS c_p
  #         ON f_h.prompt_id = c_p.id
  #     JOIN comprehension_rules AS c_r
  #         ON f_h.rule_uid = c_r.uid
  #     WHERE f_h.id IN (
  # SELECT max(f_h.id) AS id
  #     FROM feedback_histories AS f_h
  #     JOIN comprehension_prompts AS c_p
  #         ON f_h.prompt_id = c_p.id
  #     WHERE c_p.activity_id = 87
  #         AND f_h.used = true
  #     GROUP BY (rule_uid)
  # )
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
