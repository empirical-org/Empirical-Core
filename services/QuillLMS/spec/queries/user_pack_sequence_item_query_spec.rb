# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserPackSequenceItemQuery do
  subject { described_class.call(classroom.id, student.id).as_json(except: :id) }

  let(:completed) { described_class::COMPLETED_KEY }
  let(:pack_sequence_item_id) { described_class::PACK_SEQUENCE_ITEM_ID_KEY }

  let!(:student) { create(:student) }
  let!(:classroom) { create(:classroom) }
  let!(:pack_sequence) { create(:pack_sequence, classroom: classroom) }

  let!(:unit1) { create(:unit) }
  let!(:pack_sequence_item1) { create(:pack_sequence_item, pack_sequence: pack_sequence, unit: unit1, order: 1) }
  let!(:classroom_unit1) { create(:classroom_unit, unit: unit1, classroom: classroom) }
  let!(:activity_session1) { create(:activity_session, state1.to_sym, classroom_unit: classroom_unit1, user: student) }

  let!(:unit2) { create(:unit) }
  let!(:pack_sequence_item2) { create(:pack_sequence_item, pack_sequence: pack_sequence, unit: unit2, order: 2) }
  let!(:classroom_unit2) { create(:classroom_unit, unit: unit2, classroom: classroom) }
  let!(:activity_session2) { create(:activity_session, state2.to_sym, classroom_unit: classroom_unit2, user: student) }

  let!(:unit3) { create(:unit) }
  let!(:pack_sequence_item3) { create(:pack_sequence_item, pack_sequence: pack_sequence, unit: unit3, order: 3) }
  let!(:classroom_unit3) { create(:classroom_unit, unit: unit3, classroom: classroom) }
  let!(:activity_session3) { create(:activity_session, classroom_unit: classroom_unit3) }

  let!(:user_pack_sequence_item1) do
    create(:user_pack_sequence_item, pack_sequence_item: pack_sequence_item1, user: student)
  end

  let!(:user_pack_sequence_item2) do
    create(:user_pack_sequence_item, pack_sequence_item: pack_sequence_item2, user: student)
  end

  let(:finished) { ActivitySession::STATE_FINISHED }
  let(:unfinished) { ActivitySession::STATE_UNSTARTED }

  context 'activity_session1 is finished' do
    let(:state1) { finished }

    context 'activity_session2 is finished' do
      let(:state2) { finished }

      it do
        expect(subject).to eq [
          { completed => true, pack_sequence_item_id => pack_sequence_item1.id },
          { completed => true, pack_sequence_item_id => pack_sequence_item2.id }
        ]
      end
    end

    context 'activity_session2 is unfinished' do
      let(:state2) { unfinished }

      it do
        expect(subject).to eq [
          { completed => true, pack_sequence_item_id => pack_sequence_item1.id },
          { completed => false, pack_sequence_item_id => pack_sequence_item2.id }
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
          { completed => false, pack_sequence_item_id => pack_sequence_item1.id },
          { completed => true, pack_sequence_item_id => pack_sequence_item2.id }
        ]
      end
    end

    context 'activity_session2 is unfinished' do
      let(:state2) { unfinished }

      it do
        expect(subject).to eq [
          { completed => false, pack_sequence_item_id => pack_sequence_item1.id },
          { completed => false, pack_sequence_item_id => pack_sequence_item2.id }
        ]
      end
    end
  end
end

