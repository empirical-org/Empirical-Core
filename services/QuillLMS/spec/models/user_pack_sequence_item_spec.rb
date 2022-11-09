# frozen_string_literal: true

# == Schema Information
#
# Table name: user_pack_sequence_items
#
#  id                    :bigint           not null, primary key
#  status                :string           default("locked")
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  pack_sequence_item_id :bigint           not null
#  user_id               :bigint           not null
#
# Indexes
#
#  index_user_pack_sequence_items_on_pack_sequence_item_id     (pack_sequence_item_id)
#  index_user_pack_sequence_items_on_user_id                   (user_id)
#  on_user_pack_sequence_items_on_user_and_pack_sequence_item  (user_id,pack_sequence_item_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (pack_sequence_item_id => pack_sequence_items.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe UserPackSequenceItem, type: :model do

  context 'validation' do
    it { expect(create(:user_pack_sequence_item)).to be_valid }
    it { expect(create(:user_pack_sequence_item, :locked)).to be_valid }
    it { expect(create(:user_pack_sequence_item, :unlocked)).to be_valid }

    it { expect { create(:user_pack_sequence_item, status: 'new status') }.to raise_error ActiveRecord::RecordInvalid }
  end

  context 'constraints' do
    context 'uniqueness of user and pack_sequence_item' do
      let(:user_pack_sequence_item) { create(:user_pack_sequence_item) }

      let(:duplicate_user_pack_sequence_item) do
        create(:user_pack_sequence_item,
          pack_sequence_item: user_pack_sequence_item.pack_sequence_item,
          user: user_pack_sequence_item.user
        )
      end

      it { expect { duplicate_user_pack_sequence_item }.to raise_error ActiveRecord::RecordNotUnique }
    end
  end
end
