# frozen_string_literal: true

require 'rails_helper'

describe Adapters::Csv::AdminDiagnosticOverviewDataExport do
  subject { described_class }

  describe '#format_cell' do
    it { expect(subject.format_cell(:diagnostic_name, 'Name')).to eq('NAME') }
    it { expect(subject.format_cell(:pre_students_assigned, 10)).to eq(10) }
    it { expect(subject.format_cell(:pre_students_completed, nil)).to eq(0) }
    it { expect(subject.format_cell(:students_completed_practice, nil)).to eq(0) }
    it { expect(subject.format_cell(:average_practice_activities_count, nil)).to eq(0) }
    it { expect(subject.format_cell(:average_time_spent_seconds, 0)).to eq('0:00') }
    it { expect(subject.format_cell(:post_students_assigned, 5)).to eq(5) }
    it { expect(subject.format_cell(:post_students_completed, 2)).to eq(2) }
    it { expect(subject.format_cell(:overall_skill_growth, 0.333)).to eq(33) }
  end
end
