# frozen_string_literal: true

require 'rails_helper'

describe Adapters::Csv::AdminDiagnosticSkillsSummaryDataExport do
  subject { described_class }

  describe '#format_cell' do
    it { expect(subject.format_cell(:skill_group_name, 'Name')).to eq('NAME') }
    it { expect(subject.format_cell(:pre_score, 1.0)).to eq(100) }
    it { expect(subject.format_cell(:post_score, 0.937)).to eq(94) }
    it { expect(subject.format_cell(:growth_percentage, 0)).to eq(0) }
    it { expect(subject.format_cell(:post_students_completed, 10)).to eq(10) }
    it { expect(subject.format_cell(:improved_proficiency, 2)).to eq(2) }
    it { expect(subject.format_cell(:recommended_practice, 3)).to eq(3) }
    it { expect(subject.format_cell(:maintained_proficiency, 5)).to eq(5) }
  end
end
