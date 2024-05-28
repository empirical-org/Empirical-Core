# frozen_string_literal: true

require 'rails_helper'

describe Adapters::Csv::AdminDiagnosticStudentsSummaryDataExport do
  subject { described_class }

  describe '#format_cell' do
    it { expect(subject.format_cell(:student_name, 'Student Name')).to eq('Student Name') }
    it { expect(subject.format_cell(:pre_questions_ratio, [1,2])).to eq('1 of 2') }
    it { expect(subject.format_cell(:pre_questions_percentage, 0.513)).to eq(51) }
    it { expect(subject.format_cell(:pre_skills_proficient_ratio, [2,3])).to eq('2 of 3') }
    it { expect(subject.format_cell(:pre_skills_proficient_list, ['One', 'Two', 'Three'])).to eq('One, Two, Three') }
    it { expect(subject.format_cell(:pre_skills_to_practice_list, ['Four', 'Five'])).to eq('Four, Five') }
    it { expect(subject.format_cell(:completed_activities, 10)).to eq(10) }
    it { expect(subject.format_cell(:time_spent_seconds, 65)).to eq('1:05') }
    it { expect(subject.format_cell(:post_questions_ratio, [0,5])).to eq('0 of 5') }
    it { expect(subject.format_cell(:post_questions_percentage, 0.666)).to eq(67) }
    it { expect(subject.format_cell(:post_skills_improved_or_maintained_ratio, [2,7])).to eq('2 of 7') }
    it { expect(subject.format_cell(:post_skills_improved, 2)).to eq(2) }
    it { expect(subject.format_cell(:post_skills_maintained, 2)).to eq(2) }
    it { expect(subject.format_cell(:post_skills_improved_list, ['Skill 4', 'Skill 5'])).to eq('Skill 4, Skill 5') }
    it { expect(subject.format_cell(:post_skills_maintained_list, ['Skill 1', 'Skill 2'])).to eq('Skill 1, Skill 2') }
    it { expect(subject.format_cell(:post_skills_to_practice_list, ['Skill 3', 'Skill 6'])).to eq('Skill 3, Skill 6') }
  end
end
