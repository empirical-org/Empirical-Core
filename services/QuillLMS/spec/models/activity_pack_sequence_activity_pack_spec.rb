# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_pack_sequence_activity_packs
#
#  id                        :bigint           not null, primary key
#  order                     :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  activity_pack_id          :bigint
#  activity_pack_sequence_id :bigint
#
# Indexes
#
#  index_activity_pack_sequence_activity_packs_on_act_pack_seq_id   (activity_pack_sequence_id)
#  index_activity_pack_sequence_activity_packs_on_activity_pack_id  (activity_pack_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_pack_id => units.id)
#  fk_rails_...  (activity_pack_sequence_id => activity_pack_sequences.id)
#
require 'rails_helper'

RSpec.describe ActivityPackSequenceActivityPack, type: :model do
  subject { create(:activity_pack_sequence_activity_pack) }

  it { should belong_to(:activity_pack_sequence) }
  it { should belong_to(:activity_pack) }

  it { expect(subject).to be_valid }
end
