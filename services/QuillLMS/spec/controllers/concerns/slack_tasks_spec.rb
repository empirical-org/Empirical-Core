# frozen_string_literal: true

require 'rails_helper'

describe SlackTasks do
  include SlackTasks

  let(:sales_form_submission) { create(:sales_form_submission) }

  before do
    stub_const('ENV', {'RAILS_ENV' => 'production', 'SLACK_API_WEBHOOK_SALES' => 'slack-test.com'})
  end

  describe '#post_sales_form_submission' do
    it 'should post a sales form submission to slack' do
      expect(HTTParty).to receive(:post).with('slack-test.com',
        body: {
          text: "Sales Form submitted\n #{sales_form_submission.attributes.map { |key, value| "#{key}: #{value}\n" }.join}",
        }.to_json)
      post_sales_form_submission(sales_form_submission)
    end
  end
end
