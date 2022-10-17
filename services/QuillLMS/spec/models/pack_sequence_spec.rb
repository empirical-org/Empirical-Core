# frozen_string_literal: true

# == Schema Information
#
# Table name: pack_sequences
#
#  id                     :bigint           not null, primary key
#  release_method         :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  classroom_id           :bigint
#  diagnostic_activity_id :bigint
#
# Indexes
#
#  index_pack_sequences_on_classroom_id            (classroom_id)
#  index_pack_sequences_on_diagnostic_activity_id  (diagnostic_activity_id)
#
# Foreign Keys
#
#  fk_rails_...  (classroom_id => classrooms.id)
#  fk_rails_...  (diagnostic_activity_id => activities.id)
#
require 'rails_helper'

RSpec.describe PackSequence, type: :model do
  subject { create(:pack_sequence) }

  it { should belong_to(:classroom) }
  it { should belong_to(:diagnostic_activity) }

  it { expect(subject).to be_valid }

  it { expect(subject.release_method).to eq PackSequence::STAGGERED_RELEASE }
end
