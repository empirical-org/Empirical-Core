# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe StudentsCsvGenerator do
    subject { described_class.run(data, specified_columns:) }

    let(:specified_columns) do
      [
        :student_name,
        :pre_skills_proficient_list,
        :pre_skills_to_practice_list,
        :post_skills_improved_list,
        :post_skills_maintained_list,
        :post_skills_to_practice_list
      ]
    end
 
    let(:student_name) { 'Student Name' } 
    let(:data) do
      [
        {
          student_name:,
          skill_group_name: 'ROLLUP',
          aggregate_rows: aggregate_rows
        }
      ]
    end
    let(:pre_skills_proficient) {  }
    let(:pre_skills_to_practice) {  }
    let(:post_skills_improved) {  }
    let(:post_skills_maintained) {  }
    let(:post_skills_to_practice) {  }
    let(:aggregate_rows) do
      [
        {
          student_name:,
          skill_group_name: 'skill1',
          pre_skills_proficient: 1,
          pre_skills_to_practice: 0,
          post_skills_improved: 0,
          post_skills_maintained: 1,
          post_skills_to_practice: 0
        },
        {
          student_name:,
          skill_group_name: 'skill2',
          pre_skills_proficient: 0,
          pre_skills_to_practice: 1,
          post_skills_improved: 1,
          post_skills_maintained: 0,
          post_skills_to_practice: 0
        },
        {
          student_name:,
          skill_group_name: 'skill3',
          pre_skills_proficient: 0,
          pre_skills_to_practice: 1,
          post_skills_improved: 0,
          post_skills_maintained: 0,
          post_skills_to_practice: 1
        }
      ]
    end

    # Skipping the first row since it has tooltips in it
    let(:result) { CSV.parse(subject, headers: true)[1] }

    it { expect(result['Pre: Skills Proficient (List)']).to eq('skill1') }
    it { expect(result['Pre: Skills to Practice (List)']).to eq('skill2, skill3') }
    it { expect(result['Post: Skills Improved (List)']).to eq('skill2') }
    it { expect(result['Post: Skills Maintained (List)']).to eq('skill1') }
    it { expect(result['Post: Skills with No Growth (List)']).to eq('skill3') }
  end
end
