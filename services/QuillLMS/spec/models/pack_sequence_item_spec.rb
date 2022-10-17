# frozen_string_literal: true

# == Schema Information
#
# Table name: pack_sequence_items
#
#  id               :bigint           not null, primary key
#  order            :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  item_id          :bigint
#  pack_sequence_id :bigint
#
# Indexes
#
#  index_pack_sequence_items_on_item_id           (item_id)
#  index_pack_sequence_items_on_pack_sequence_id  (pack_sequence_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => units.id)
#  fk_rails_...  (pack_sequence_id => pack_sequences.id)
#
require 'rails_helper'

RSpec.describe PackSequenceItem, type: :model do
  subject { create(:pack_sequence_item) }

  it { should belong_to(:pack_sequence) }
  it { should belong_to(:item) }

  it { expect(subject).to be_valid }
end
