# frozen_string_literal: true

require 'rails_helper'

describe OpenAI::TranslateActivityAndQuestionsWorker, type: :worker do
  let(:worker) { described_class.new }
  let(:activity) { create(:activity) }

  context 'an activity_id is passed in' do
    subject{ worker.perform(activity.id) }

    before do
      allow(OpenAI::Translate).to receive(:run)
      allow(Activity).to receive(:find_by).with(id: activity.id).and_return(activity)
    end

    it 'calls translate! on the activity' do
      expect(activity).to receive(:translate!)
      subject
    end

    it 'calls translate on each of the questions' do
      question = create(:question)
      activity.data["questions"] = [{ "key" => question.uid }]
      allow(activity).to receive(:questions).and_return([question])
      expect(question).to receive(:translate!)
      subject
    end
  end

  context 'the activity is not present' do
    subject{ worker.perform("223980") }

    it do
      expect(OpenAI::Translate).not_to receive(:run)
      subject
    end
  end
end
