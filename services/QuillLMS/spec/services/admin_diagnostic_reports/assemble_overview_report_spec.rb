# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe AssembleOverviewReport do
    subject { described_class.run(payload) }

    let(:payload) { {example: 'payload'} }
    let(:diagnostic_id) { 1663 }
    let(:aggregate_id) { 1 }

    let(:pre_assigned_results) { [pre_assigned_result1] }
    let(:pre_assigned_result1) do
      {
        diagnostic_id:,
        pre_students_assigned: 1,
        aggregate_rows: pre_assigned_aggregate_rows
      }
    end
    let(:pre_assigned_aggregate_row1) { {aggregate_id:, pre_students_assigned: 1} }
    let(:pre_assigned_aggregate_rows) { [pre_assigned_aggregate_row1] }

    let(:pre_completed_results) { [pre_completed_result1] }
    let(:pre_completed_result1) do
      {
        diagnostic_id:,
        pre_students_completed: 1,
        pre_average_score: 1.0,
        aggregate_rows: pre_completed_aggregate_rows
      }
    end
    let(:pre_completed_aggregate_row1) { {aggregate_id:, pre_students_completed: 1, pre_average_score: 1.0} }
    let(:pre_completed_aggregate_rows) { [pre_completed_aggregate_row1] }

    let(:recommendations_results) { [recommendations_result1] }
    let(:recommendations_result1) do
      {
        diagnostic_id:,
        students_completed_practice: 1,
        average_practice_activities_count: 5,
        average_time_spent_seconds: 600,
        aggregate_rows: recommendations_aggregate_rows
      }
    end
    let(:recommendations_aggregate_row1) { {aggregate_id:, students_completed_practice: 1, average_practice_activities_count: 5, average_time_spent_seconds: 600} }
    let(:recommendations_aggregate_rows) { [recommendations_aggregate_row1] }

    let(:post_assigned_results) { [post_assigned_result1] }
    let(:post_assigned_result1) do
      {
        diagnostic_id:,
        post_students_assigned: 1,
        aggregate_rows: post_assigned_aggregate_rows
      }
    end
    let(:post_assigned_aggregate_row1) { {aggregate_id:, post_students_assigned: 1} }
    let(:post_assigned_aggregate_rows) { [post_assigned_aggregate_row1] }

    let(:post_completed_results) { [post_completed_result1] }
    let(:post_completed_result1) do
      {
        diagnostic_id:,
        post_students_completed: 1,
        overall_skill_growth: 0,
        aggregate_rows: post_completed_aggregate_rows
      }
    end
    let(:post_completed_aggregate_row1) { {aggregate_id:, post_students_completed: 1, overall_skill_growth: 0} }
    let(:post_completed_aggregate_rows) { [post_completed_aggregate_row1] }

    let(:expected_keys) do
      [
        :diagnostic_id,
        :pre_students_assigned,
        :pre_students_completed,
        :pre_average_score,
        :students_completed_practice,
        :average_practice_activities_count,
        :average_time_spent_seconds,
        :post_students_assigned,
        :post_students_completed,
        :overall_skill_growth,
        :aggregate_rows
      ]
    end
    let(:expected_aggregate_row_keys) do
      expected_keys.to_set.delete(:diagnostic_id)
        .delete(:aggregate_rows)
        .add(:aggregate_id)
        .to_a
    end

    before do
      allow(AdminDiagnosticReports::PreDiagnosticAssignedViewQuery).to receive(:run).with(**payload).and_return(pre_assigned_results)
      allow(AdminDiagnosticReports::PreDiagnosticCompletedViewQuery).to receive(:run).with(**payload).and_return(pre_completed_results)
      allow(AdminDiagnosticReports::DiagnosticRecommendationsQuery).to receive(:run).with(**payload).and_return(recommendations_results)
      allow(AdminDiagnosticReports::PostDiagnosticAssignedViewQuery).to receive(:run).with(**payload).and_return(post_assigned_results)
      allow(AdminDiagnosticReports::PostDiagnosticCompletedViewQuery).to receive(:run).with(**payload).and_return(post_completed_results)
    end

    context '#run' do
      it { expect(subject.first.keys).to match_array(expected_keys) }
      it { expect(subject.first[:aggregate_rows].first.keys).to match_array(expected_aggregate_row_keys) }

      context 'some queries have no data for params' do
        let(:recommendations_results) { [] }
        let(:post_completed_assigned) { [] }

        it { expect(subject.first.keys).to eq(expected_keys) }
      end

      context 'multiple diagnostics' do
        let(:diagnostic_id2) { 1668 }

        let(:pre_assigned_result2) do
          {
            diagnostic_id: diagnostic_id2,
            pre_students_assigned: 2,
            aggregate_rows: pre_assigned_aggregate_rows
          }
        end
        let(:pre_assigned_results) { [pre_assigned_result1, pre_assigned_result2] }

        let(:pre_completed_result2) do
          {
            diagnostic_id: diagnostic_id2,
            pre_students_completed: 0,
            pre_average_score: 0.0,
            aggregate_rows: pre_completed_aggregate_rows
          }
        end
        let(:pre_completed_results) { [pre_completed_result1, pre_completed_result2] }

        let(:recommendations_result2) { {} }
        let(:recommendations_results) { [recommendations_result1, recommendations_result2] }

        let(:post_assigned_result2) { {} }
        let(:post_assigned_results) { [post_assigned_result1, post_assigned_result2] }

        let(:post_completed_result2) do
          {
            diagnostic_id: diagnostic_id2,
            post_students_completed: 1,
            overall_skill_growth: 0,
            aggregate_rows: post_completed_aggregate_rows
          }
        end
        let(:post_completed_results) { [post_completed_result1, post_completed_result2] }

        it { expect(subject.length).to eq(2) }
        it { expect(subject.first.keys.length).to eq(subject.second.keys.length) }

        context 'component queries not all in the same order' do
          let(:pre_assigned_results) { [pre_assigned_result2, pre_assigned_result1] }

          it do
            expect(subject.select { |row| row[:diagnostic_id] == pre_assigned_result1[:diagnostic_id] }.first).to include(
              {
                pre_students_assigned: pre_assigned_result1[:pre_students_assigned],
                pre_students_completed: pre_completed_result1[:pre_students_completed],
                pre_average_score: pre_completed_result1[:pre_average_score],
                students_completed_practice: recommendations_result1[:students_completed_practice],
                average_practice_activities_count: recommendations_result1[:average_practice_activities_count],
                average_time_spent_seconds: recommendations_result1[:average_time_spent_seconds],
                post_students_assigned: post_assigned_result1[:post_students_assigned],
                post_students_completed: post_completed_result1[:post_students_completed],
                overall_skill_growth: post_completed_result1[:overall_skill_growth]
              }
            )
          end

          it do
            expect(subject.select { |row| row[:diagnostic_id] == pre_assigned_result2[:diagnostic_id] }.first).to include(
              {
                pre_students_assigned: pre_assigned_result2[:pre_students_assigned],
                pre_students_completed: pre_completed_result2[:pre_students_completed],
                pre_average_score: pre_completed_result2[:pre_average_score],
                students_completed_practice: recommendations_result2[:students_completed_practice],
                average_practice_activities_count: recommendations_result2[:average_practice_activities_count],
                average_time_spent_seconds: recommendations_result2[:average_time_spent_seconds],
                post_students_assigned: post_assigned_result2[:post_students_assigned],
                post_students_completed: post_completed_result2[:post_students_completed],
                overall_skill_growth: post_completed_result2[:overall_skill_growth]
              }
            )
          end
        end

        context 'multiple aggregate rows' do
          let(:aggregate_id2) { 2 }

          let(:pre_assigned_aggregate_row2) { {aggregate_id: aggregate_id2, pre_students_assigned: 1} }
          let(:pre_assigned_aggregate_rows) { [pre_assigned_aggregate_row1, pre_assigned_aggregate_row2] }

          let(:pre_completed_aggregate_row2) { {aggregate_id: aggregate_id2, pre_students_completed: 1, pre_average_score: 1.0} }
          let(:pre_completed_aggregate_rows) { [pre_completed_aggregate_row1, pre_completed_aggregate_row2] }

          let(:recommendations_aggregate_row2) { {} }
          let(:recommendations_aggregate_rows) { [recommendations_aggregate_row1, recommendations_aggregate_row2] }

          let(:post_assigned_aggregate_row2) { {} }
          let(:post_assigned_aggregate_rows) { [post_assigned_aggregate_row1, post_assigned_aggregate_row2] }

          let(:post_completed_aggregate_row2) { {aggregate_id: aggregate_id2, post_students_completed: 1, overall_skill_growth: 0} }
          let(:post_completed_aggregate_rows) { [post_completed_aggregate_row1, post_completed_aggregate_row2] }

          it { expect(subject.map { |row| row[:aggregate_rows].length }).to eq([2, 2]) }

          context 'component queries not all in the same order' do
            let(:pre_assigned_aggregate_rows) { [pre_assigned_aggregate_row2, pre_assigned_aggregate_row1] }

            it do
              expect(subject.select { |row| row[:diagnostic_id] == pre_assigned_result1[:diagnostic_id] }
                .first[:aggregate_rows]
                .select { |aggregate_row| aggregate_row[:aggregate_id] == pre_assigned_aggregate_row1[:aggregate_id] }
                .first).to include(
                {
                  pre_students_assigned: pre_assigned_aggregate_row1[:pre_students_assigned],
                  pre_students_completed: pre_completed_aggregate_row1[:pre_students_completed],
                  pre_average_score: pre_completed_aggregate_row1[:pre_average_score],
                  students_completed_practice: recommendations_aggregate_row1[:students_completed_practice],
                  average_practice_activities_count: recommendations_aggregate_row1[:average_practice_activities_count],
                  average_time_spent_seconds: recommendations_aggregate_row1[:average_time_spent_seconds],
                  post_students_assigned: post_assigned_aggregate_row1[:post_students_assigned],
                  post_students_completed: post_completed_aggregate_row1[:post_students_completed],
                  overall_skill_growth: post_completed_aggregate_row1[:overall_skill_growth]
                }
              )
            end
          end
        end
      end
    end
  end
end
