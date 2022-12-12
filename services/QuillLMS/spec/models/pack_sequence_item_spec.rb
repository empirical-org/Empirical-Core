# frozen_string_literal: true

# == Schema Information
#
# Table name: pack_sequence_items
#
#  id               :bigint           not null, primary key
#  order            :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  pack_sequence_id :bigint
#  unit_id          :bigint
#
# Indexes
#
#  index_pack_sequence_items_on_pack_sequence_id              (pack_sequence_id)
#  index_pack_sequence_items_on_pack_sequence_id_and_unit_id  (pack_sequence_id,unit_id) UNIQUE
#  index_pack_sequence_items_on_unit_id                       (unit_id)
#
# Foreign Keys
#
#  fk_rails_...  (pack_sequence_id => pack_sequences.id)
#  fk_rails_...  (unit_id => units.id)
#
require 'rails_helper'

RSpec.describe PackSequenceItem, type: :model do
  subject { create(:pack_sequence_item) }

  it { should belong_to(:pack_sequence) }
  it { should belong_to(:unit) }

  it { expect(subject).to be_valid }

  context 'constraints' do
    context 'uniqueness of unit and pack_sequence' do
      let(:pack_sequence_item) { create(:pack_sequence_item) }

      let(:duplicate_pack_sequence_item) do
        create(:pack_sequence_item,
          pack_sequence: pack_sequence_item.pack_sequence,
          unit: pack_sequence_item.unit
        )
      end

      it { expect { duplicate_pack_sequence_item }.to raise_error ActiveRecord::RecordNotUnique }
    end
  end
end
