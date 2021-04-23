require 'rails_helper'

describe RematchAllQuestionsJob, type: :worker do
  let(:worker) { described_class.new }

  it 'post to CMS url for only live questions' do
    stub_const("RematchAllQuestionsJob::REMATCH_URL", "test_url")

    prod_question = create(:question,
      data: {flag: Question::FLAG_PRODUCTION},
      question_type: Question::TYPE_CONNECT_SENTENCE_COMBINING,
      uid: 'prod_question'
    )
    beta_question = create(:question,
      data: {flag: Question::FLAG_BETA},
      question_type: Question::TYPE_CONNECT_SENTENCE_COMBINING,
      uid: 'beta_question'
    )
    # will not be sent
    archived_question = create(:question,
      data: {flag: Question::FLAG_ARCHIVED},
      question_type: Question::TYPE_CONNECT_SENTENCE_COMBINING,
      uid: 'archived_question'
    )

    expect(HTTParty).to receive(:post).with(
      "test_url",
      body: {type: 'questions', uid: 'prod_question'}.to_json,
      headers:  {'Content-Type' => 'application/json', 'Accept' => 'application/json'}
    ).once

    expect(HTTParty).to receive(:post).with(
      "test_url",
      body: {type: 'questions', uid: 'beta_question'}.to_json,
      headers:  {'Content-Type' => 'application/json', 'Accept' => 'application/json'}
    ).once

    worker.perform
  end
end
