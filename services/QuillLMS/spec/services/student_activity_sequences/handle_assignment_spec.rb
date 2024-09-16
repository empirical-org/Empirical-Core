# frozen_string_literal: true

require 'rails_helper'

module StudentActivitySequences
  describe HandleAssignment do
    subject { described_class.run(classroom_unit_id, student_id) }

    let(:classroom_unit_id) { classroom_unit.id }
    let(:student_id) { student.id }
    let(:student) { create(:student) }
    let(:classroom) { create(:classroom) }
    let(:pre_diagnostic) { create(:pre_diagnostic_activity) }
    let(:pre_unit_template) { create(:unit_template, activities: [pre_diagnostic]) }
    let(:pre_unit) { create(:unit, unit_template: pre_unit_template, activities: [pre_diagnostic]) }
    let(:pre_classroom_unit) { create(:classroom_unit, classroom:, unit: pre_unit, assigned_student_ids: [student_id]) }
    let(:classroom_unit) { pre_classroom_unit }

    it do
      expect { subject }.to change(StudentActivitySequence, :count).by(1)
        .and change(StudentActivitySequenceActivity, :count).by(1)
    end

    context 'when running a backfill' do
      subject { described_class.run(classroom_unit_id, student_id, true) }

      before { subject }
 
      it { expect(StudentActivitySequence.first.created_at).to eq(classroom_unit.updated_at) }
      it { expect(StudentActivitySequence.first.updated_at).to eq(classroom_unit.updated_at) }
    end

    context 'new pre-diagnostic assignment when an existing one already has a sequence' do
      let!(:student_activity_sequence) { create(:student_activity_sequence, user: student, initial_activity: pre_diagnostic, initial_classroom_unit: pre_classroom_unit, classroom: pre_classroom_unit.classroom) }
      let(:pre_unit2) { create(:unit, unit_template: pre_unit_template, activities: [pre_diagnostic]) }
      let(:pre_classroom_unit2) { create(:classroom_unit, classroom:, unit: pre_unit2, assigned_student_ids: [student_id]) }
      let(:classroom_unit) { pre_classroom_unit2 }

      it do
        expect { subject }.to change(StudentActivitySequence, :count).by(1)
      end
    end

    context 'pre-diagnostic already recorded' do
      let(:student_activity_sequence) { create(:student_activity_sequence, user: student, initial_activity: pre_diagnostic, initial_classroom_unit: pre_classroom_unit, classroom: pre_classroom_unit.classroom) }
      let!(:student_activity_sequence_activity) { create(:student_activity_sequence_activity, student_activity_sequence:, activity: pre_diagnostic, classroom_unit: pre_classroom_unit) }

      it do
        expect { subject }.to not_change(StudentActivitySequence, :count)
          .and not_change(StudentActivitySequenceActivity, :count)
      end

      context 'handle assigning recommended activities' do
        let(:recommended_activity) { create(:activity) }
        let(:unit_template) { create(:unit_template, activities: [recommended_activity]) }
        let(:unit) { create(:unit, unit_template:, activities: [recommended_activity]) }
        let(:classroom_unit) { create(:classroom_unit, classroom:, unit:, assigned_student_ids: [student_id]) }
        let!(:recommendation) { create(:recommendation, activity: pre_diagnostic, unit_template:) }

        it do
          expect { subject }.to not_change(StudentActivitySequence, :count)
            .and change(StudentActivitySequenceActivity, :count).by(1)
        end

        context 'multiple pre-diagnostic assignments recorded' do
          let(:pre_unit2) { create(:unit, unit_template: pre_unit_template, activities: [pre_diagnostic]) }
          let(:pre_classroom_unit2) { create(:classroom_unit, classroom:, unit: pre_unit2, assigned_student_ids: [student_id]) }
          let!(:student_activity_sequence2) { create(:student_activity_sequence, user: student, initial_activity: pre_diagnostic, initial_classroom_unit: pre_classroom_unit2, classroom:, created_at: student_activity_sequence.created_at + 1.day) }

          it do
            expect { subject }.to change { student_activity_sequence2.reload.student_activity_sequence_activities.count }.by(1)
              .and not_change { student_activity_sequence.reload.student_activity_sequence_activities.count }
          end
        end

        context 'recommended activity already recorded' do
          let!(:recommended_sequence_activity) { create(:student_activity_sequence_activity, student_activity_sequence:, activity: recommended_activity, classroom_unit:) }

          it do
            expect { subject }.to not_change(StudentActivitySequence, :count)
              .and not_change(StudentActivitySequenceActivity, :count)
          end
        end

        context 'with no pre-diagnostic in sequence' do
          let(:student_activity_sequence_activity) { nil }

          it do
            expect { subject }.to not_change(StudentActivitySequence, :count)
              .and not_change(StudentActivitySequenceActivity, :count)
          end
        end
      end

      context 'handle assigning a post-diagnostic' do
        let(:post_diagnostic) { pre_diagnostic.follow_up_activity }
        let(:post_unit_template) { create(:unit_template, activities: [post_diagnostic]) }
        let(:post_unit) { create(:unit, unit_template: post_unit_template, activities: [post_diagnostic]) }
        let(:post_classroom_unit) { create(:classroom_unit, classroom:, unit: post_unit, assigned_student_ids: [student_id]) }
        let(:classroom_unit) { create(:classroom_unit, classroom:, unit: post_unit, assigned_student_ids: [student_id]) }

        it do
          expect { subject }.to not_change(StudentActivitySequence, :count)
            .and change(StudentActivitySequenceActivity, :count).by(1)
        end

        context 'post-diagnostic activity already recorded' do
          let!(:post_sequence_activity) { create(:student_activity_sequence_activity, student_activity_sequence:, activity: post_diagnostic, classroom_unit:) }

          it do
            expect { subject }.to not_change(StudentActivitySequence, :count)
              .and not_change(StudentActivitySequenceActivity, :count)
          end
        end

        context 'with no pre-diagnostic in sequence' do
          let(:student_activity_sequence_activity) { nil }

          it do
            expect { subject }.to not_change(StudentActivitySequence, :count)
              .and not_change(StudentActivitySequenceActivity, :count)
          end
        end
      end
    end
  end
end
