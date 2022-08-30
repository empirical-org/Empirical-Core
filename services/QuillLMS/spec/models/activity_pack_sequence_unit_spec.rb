# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_pack_sequence_units
#
#  id                        :bigint           not null, primary key
#  order                     :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  activity_pack_sequence_id :bigint
#  unit_id                   :bigint
#
# Indexes
#
#  index_activity_pack_sequence_units_on_activity_pack_sequence_id  (activity_pack_sequence_id)
#  index_activity_pack_sequence_units_on_unit_id                    (unit_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_pack_sequence_id => activity_pack_sequences.id)
#  fk_rails_...  (unit_id => units.id)
#
require 'rails_helper'

RSpec.describe ActivityPackSequenceUnit, type: :model do
  subject { create(:activity_pack_sequence_unit) }

  it { should belong_to(:activity_pack_sequence) }
  it { should belong_to(:unit) }

  it { expect(subject).to be_valid }
end
