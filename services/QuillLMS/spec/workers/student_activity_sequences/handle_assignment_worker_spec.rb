# frozen_string_literal: true

require 'rails_helper'

module StudentActivitySequences
  describe HandleAssignmentWorker do
    subject { described_class.new.perform(classroom_unit_id, student_id) }

    let(:classroom_unit_id) { 1 }
    let(:student_id) { 2 }

    it do
      expect(HandleAssignment).to receive(:run).with(classroom_unit_id, student_id)
      subject
    end
  end
end
