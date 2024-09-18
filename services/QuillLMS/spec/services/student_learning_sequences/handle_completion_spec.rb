# frozen_string_literal: true

require 'rails_helper'

module StudentLearningSequences
  describe HandleCompletion do
    subject { described_class.run(activity_session_id) }

    let(:student_learning_sequence) { create(:student_learning_sequence) }
    let(:activity_session) { create(:activity_session, user: student_learning_sequence.user) }
    let(:activity_session_id) { activity_session.id }
    let(:pre_diagnostic) { student_learning_sequence.initial_activity }
    let(:activity) { activity_session.activity }
    let(:classroom_unit) { activity_session.classroom_unit }

    # TODO: Re-enable this after we update the raise code in the service post-backfill
    #it { expect { subject }.to raise_error(described_class::MissingSequenceActivityError) }

    context 'item was assigned to the sequence previously' do
      let(:student_learning_sequence_activity) { create(:student_learning_sequence_activity, student_learning_sequence:, activity:, classroom_unit:) }

      it { expect { subject }.to change { student_learning_sequence_activity.reload.activity_session_id }.from(nil).to(activity_session_id) }
      it { expect { subject }.to change { student_learning_sequence_activity.reload.completed_at }.from(nil).to(activity_session.reload.completed_at) }
    end
  end
end
