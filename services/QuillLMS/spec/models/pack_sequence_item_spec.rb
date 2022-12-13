# frozen_string_literal: true

# == Schema Information
#
# Table name: pack_sequence_items
#
#  id                :bigint           not null, primary key
#  order             :integer          not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  classroom_unit_id :bigint           not null
#  pack_sequence_id  :bigint           not null
#
# Indexes
#
#  index_pack_sequence_items__classroom_unit_id__pack_sequence_id  (classroom_unit_id,pack_sequence_id) UNIQUE
#  index_pack_sequence_items_on_classroom_unit_id                  (classroom_unit_id)
#  index_pack_sequence_items_on_pack_sequence_id                   (pack_sequence_id)
#
# Foreign Keys
#
#  fk_rails_...  (classroom_unit_id => classroom_units.id)
#  fk_rails_...  (pack_sequence_id => pack_sequences.id)
#
require 'rails_helper'

RSpec.describe PackSequenceItem, type: :model do
  subject { create(:pack_sequence_item) }

  it { should belong_to(:pack_sequence) }
  it { should belong_to(:classroom_unit) }

  it { expect(subject).to be_valid }

  context 'constraints' do
    context 'uniqueness of unit and pack_sequence' do
      let(:pack_sequence_item) { create(:pack_sequence_item) }

      let(:duplicate_pack_sequence_item) do
        create(:pack_sequence_item,
          pack_sequence: pack_sequence_item.pack_sequence,
          classroom_unit: pack_sequence_item.classroom_unit
        )
      end

      it { expect { duplicate_pack_sequence_item }.to raise_error ActiveRecord::RecordNotUnique }
    end
  end

  describe 'save_user_pack_sequence_items' do
    let(:pack_sequence_item) { create(:pack_sequence_item) }
    let(:num_user_pack_sequence_items) { 2 }
    let(:num_jobs) { num_user_pack_sequence_items }

    before { create_list(:user_pack_sequence_item, num_user_pack_sequence_items, pack_sequence_item: pack_sequence_item) }

    context 'after_save' do
      context 'order has changed' do
        subject { pack_sequence_item.reload.update(order: pack_sequence_item.order + 1) }

        it { expect { subject }.to change { SaveUserPackSequenceItemsWorker.jobs.size }.by(num_jobs) }
      end
    end

    context 'after_destroy' do
      subject { pack_sequence_item.destroy }

      it { expect { subject }.to change { SaveUserPackSequenceItemsWorker.jobs.size }.by(num_jobs) }
    end
  end
end
