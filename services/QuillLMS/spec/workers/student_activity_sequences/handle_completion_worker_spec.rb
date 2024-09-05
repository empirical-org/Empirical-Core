# frozen_string_literal: true

require 'rails_helper'

module StudentActivitySequences
  describe HandleCompletionWorker do
    subject { described_class.new.perform(activity_session_id) }

    let(:activity_session_id) { 1 }

    it do
      expect(HandleCompletion).to receive(:run).with(activity_session_id)
      subject
    end
  end
end
