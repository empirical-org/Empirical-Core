# frozen_string_literal: true

require 'rails_helper'

describe OpenAI::TranslateActivityAndQuestionsWorker, type: :worker do
  let(:worker) { described_class.new }

  context 'an activity_id is passed in' do
    let(:activity) { create(:activity )}

    subject{worker.perform(activity.id)}

    it do
      expect(OpenAI::TranslateActivityAndQuestions).to receive(:run).with(activity)
      subject
    end
  end

  context 'the activity is not present' do
    subject{worker.perform("223980")}

    it do
      expect(OpenAI::TranslateActivityAndQuestions).not_to receive(:run)
      subject
    end
  end

end
