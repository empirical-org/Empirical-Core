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
require 'spec_helper'

RSpec.describe PackSequenceItem, type: :model do
  subject { build(:pack_sequence_item) }

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
end
