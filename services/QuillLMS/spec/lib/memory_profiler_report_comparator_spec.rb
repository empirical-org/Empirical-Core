# frozen_string_literal: true

require 'rails_helper'

RSpec.describe MemoryProfilerReportComparator do
  let(:report1) { MemoryProfilerReport.run { create_list(:user, 1) } }
  let(:report2) { MemoryProfilerReport.run { create_list(:user, 2) } }

  context 'one report' do
    subject { described_class.run(report1) }

    it { expect(subject.keys).to eq [:memory_allocated, :objects_allocated, :memory_retained, :objects_retained] }
  end

  context 'two reports' do
    subject { described_class.run(report1, report2) }

    it { expect(subject.keys).to eq [:memory_allocated_diff, :objects_allocated_diff, :memory_retained_diff, :objects_retained_diff] }
  end
end
