# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe AssembleSkillsReport do
    subject { described_class.run(payload) }

    let(:payload) { { example: 'payload' } }

    it do
      expect(AdminDiagnosticReports::DiagnosticPerformanceBySkillViewQuery).to receive(:run).with(**payload)

      subject
    end
  end
end
