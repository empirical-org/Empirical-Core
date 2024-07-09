# frozen_string_literal: true

require 'rails_helper'
RSpec.describe OpenAI::TranslateActivityAndQuestions, type: :service do
  describe "run" do
    subject { described_class.run(activity)}

    let(:activity) { create(:activity)}

    before do
      allow_any_instance_of(Translatable).to receive(:translate!)
    end

    it 'calls translate! on the activity' do
      expect(activity).to receive(:translate!)
      subject
    end

    it 'calls translate on each of the questions' do
      question = create(:question)
      activity.data["questions"] = [{"key" => question.uid}]
      allow(activity).to receive(:questions).and_return([question])
      expect(question).to receive(:translate!)
      subject
    end

  end
end
