class Feedback
  include HTTParty
  base_uri 'us-central1-comprehension-247816.cloudfunctions.net/comprehension-endpoint-go'

  format :json
  attr_reader :prompt_id, :entry

  def initialize(prompt_id:, entry:)
    @prompt_id = prompt_id
    @entry = entry
  end

  def response
    self.class.post('',
      body: {entry: entry, prompt_id: prompt_id, attempt: 0, session_id: 'fakestring'}.to_json,
      headers: {'Content-Type' => 'application/json'}
    )
  end
end

