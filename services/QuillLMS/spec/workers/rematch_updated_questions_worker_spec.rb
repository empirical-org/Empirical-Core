# frozen_string_literal: true

require 'rails_helper'

describe RematchUpdatedQuestionsWorker, type: :worker do
  let(:worker) { described_class.new }

  it 'post to CMS url for only production questions' do
    stub_const("RematchUpdatedQuestionsWorker::REMATCH_URL", "test_url")

    prod_question = create(:question,
      data: {flag: Question::FLAG_PRODUCTION},
      question_type: Question::TYPE_CONNECT_SENTENCE_COMBINING,
      uid: 'prod_question'
    )

    prod_question2 = create(:question,
      data: {flag: Question::FLAG_PRODUCTION},
      question_type: Question::TYPE_CONNECT_SENTENCE_COMBINING,
      uid: 'prod_question2'
    )

    prod_question3 = create(:question,
      data: {flag: Question::FLAG_PRODUCTION},
      question_type: Question::TYPE_CONNECT_SENTENCE_COMBINING,
      uid: 'prod_question3'
    )

    # will not be sent since out of the default window
    prod_question3.update_column(:updated_at, 1.year.ago)

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
      body: {type: 'questions', uid: 'prod_question', delay: 0}.to_json,
      headers:  {'Content-Type' => 'application/json', 'Accept' => 'application/json'}
    ).once

    expect(HTTParty).to receive(:post).with(
      "test_url",
      body: {type: 'questions', uid: 'prod_question2', delay: 7}.to_json,
      headers:  {'Content-Type' => 'application/json', 'Accept' => 'application/json'}
    ).once

    worker.perform(30.minutes.ago, Time.current, 7)
  end
end
