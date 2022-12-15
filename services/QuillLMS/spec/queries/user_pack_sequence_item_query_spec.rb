# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserPackSequenceItemQuery do
  subject { described_class.call(classroom.id, student.id).as_json(except: :id) }

  let!(:student) { create(:student) }
  let!(:classroom) { create(:classroom) }
  let!(:pack_sequence1) { create(:pack_sequence, classroom: classroom) }

  let!(:classroom_unit1) { create(:classroom_unit, classroom: classroom) }
  let!(:pack_sequence_item1) { create(:pack_sequence_item, pack_sequence: pack_sequence1, classroom_unit: classroom_unit1, order: 1) }
  let!(:activity_session1) { create(:activity_session, state1.to_sym, classroom_unit: classroom_unit1, user: student) }

  let!(:classroom_unit2) { create(:classroom_unit, classroom: classroom) }
  let!(:pack_sequence_item2) { create(:pack_sequence_item, pack_sequence: pack_sequence1, classroom_unit: classroom_unit2, order: 2) }
  let!(:activity_session2) { create(:activity_session, state2.to_sym, classroom_unit: classroom_unit2, user: student) }

  let!(:classroom_unit3) { create(:classroom_unit, classroom: classroom) }
  let!(:pack_sequence_item3) { create(:pack_sequence_item, pack_sequence: pack_sequence1, classroom_unit: classroom_unit3, order: 3) }
  let!(:activity_session3) { create(:activity_session, classroom_unit: classroom_unit3) }

  let!(:pack_sequence2) { create(:pack_sequence, classroom: classroom) }

  let!(:classroom_unit4) { create(:classroom_unit, classroom: classroom) }
  let!(:pack_sequence_item4) { create(:pack_sequence_item, pack_sequence: pack_sequence2, classroom_unit: classroom_unit4, order: 1) }
  let!(:activity_session4) { create(:activity_session, classroom_unit: classroom_unit4, user: student) }

  let(:finished) { ActivitySession::STATE_FINISHED }
  let(:unfinished) { ActivitySession::STATE_UNSTARTED }

  context 'activity_session1 is finished' do
    let(:state1) { finished }

    context 'activity_session2 is finished' do
      let(:state2) { finished }

      it do
        expect(subject).to eq [
          result(true, pack_sequence1, pack_sequence_item1),
          result(true, pack_sequence1, pack_sequence_item2),
          result(true, pack_sequence2, pack_sequence_item4)
        ]
      end
    end

    context 'activity_session2 is unfinished' do
      let(:state2) { unfinished }

      it do
        expect(subject).to eq [
          result(true, pack_sequence1, pack_sequence_item1),
          result(false, pack_sequence1, pack_sequence_item2),
          result(true, pack_sequence2, pack_sequence_item4)
        ]
      end
    end
  end

  context 'activity_session1 is unfinished' do
    let(:state1) { unfinished }

    context 'activity_session2 is finished' do
      let(:state2) { finished }

      it do
        expect(subject).to eq [
          result(false, pack_sequence1, pack_sequence_item1),
          result(true, pack_sequence1, pack_sequence_item2),
          result(true, pack_sequence2, pack_sequence_item4)
        ]
      end
    end

    context 'activity_session2 is unfinished' do
      let(:state2) { unfinished }

      it do
        expect(subject).to eq [
          result(false, pack_sequence1, pack_sequence_item1),
          result(false, pack_sequence1, pack_sequence_item2),
          result(true, pack_sequence2, pack_sequence_item4)
        ]
      end
    end
  end

  def result(completed, pack_sequence, pack_sequence_item)
    {
      described_class::COMPLETED_KEY => completed,
      described_class::PACK_SEQUENCE_ID_KEY => pack_sequence.id,
      described_class::PACK_SEQUENCE_ITEM_ID_KEY => pack_sequence_item.id
    }
  end
end

