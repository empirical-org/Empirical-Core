# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe SkillsCsvGenerator do
    subject { described_class.run(data, specified_columns:) }
    let(:rows) { CSV.parse(subject).map { |row| row.join(',') } }
  
    let(:specified_columns) { data.first.except(:aggregate_rows).keys }
    let(:skill_group_name1) { 'Starter Diagnostic' }
    let(:skill_group_name2) { 'Intermediate Diagnotic' }
    let(:aggregate_row_name1) { 'Grade 9' }
    let(:pre_score1) { 0.7 }
    let(:pre_score2) { 0.5 }
    let(:post_score1) { 0.9 }
    let(:post_score2) { 0.6 }
    let(:data) do
      [
        {
          skill_group_name: skill_group_name1,
          pre_score: pre_score1,
          post_score: post_score1,
          aggregate_rows: aggregate_rows
        },
        {
          skill_group_name: skill_group_name2,
          pre_score: pre_score2,
          post_score: post_score2,
        }
      ]
    end
    let(:aggregate_rows) do
      [
        {
          name: aggregate_row_name1,
          pre_score: pre_score1,
          post_score: post_score1,
        }
      ]
    end
    let(:processed_pre_score1) { (pre_score1 * 100).round }
    let(:processed_post_score1) { (post_score1 * 100).round }
    let(:processed_pre_score2) { (pre_score2 * 100).round }
    let(:processed_post_score2) { (post_score2 * 100).round }

    let(:first_grouped_row) { [skill_group_name1.upcase, processed_pre_score1, processed_post_score1].join(',') }
    let(:first_sub_row) { [aggregate_row_name1, processed_pre_score1, processed_post_score1].join(',') }
    let(:second_grouped_row) { [skill_group_name2.upcase, processed_pre_score2, processed_post_score2].join(',') }

    it { expect(rows.third).to eq(first_grouped_row) }
    it { expect(rows.fourth).to eq(first_sub_row) }
    it { expect(rows.fifth).to eq(first_grouped_row) }
  end
end
