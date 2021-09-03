# == Schema Information
#
# Table name: provider_classroom_users
#
#  id                    :bigint           not null, primary key
#  deleted_at            :datetime
#  type                  :string           not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  provider_classroom_id :string           not null
#  provider_user_id      :string           not null
#
# Indexes
#
#  index_provider_type_and_classroom_id_and_user_id  (type,provider_classroom_id,provider_user_id) UNIQUE
#
require 'rails_helper'

RSpec.describe GoogleClassroomUser, type: :model do
  let(:google_id) { '12345' }
  let(:google_classroom_id) { '67890' }

  subject do
    create(:google_classroom_user,
      provider_user_id: google_id,
      provider_classroom_id: google_classroom_id
    )
  end

  it { expect(subject.google_classroom_id).to eq google_classroom_id }
  it { expect(subject.google_id).to eq google_id }
  it { expect(subject.type).to eq described_class.to_s }
end
