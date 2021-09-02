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
#  index_provider_classroom_users_on_provider_classroom_id    (provider_classroom_id)
#  index_provider_classroom_users_on_provider_user_id         (provider_user_id)
#  index_provider_user_id_and_provider_classroom_id_and_type  (provider_user_id,provider_classroom_id,type) UNIQUE
#
require 'rails_helper'

RSpec.describe ProviderClassroomUser, type: :model do
  let(:type) { described_class.to_s }

  context 'attributes' do
    subject { create(:provider_classroom_user, type: type) }

    it { expect(subject.provider_classroom_id).to_not be_nil }
    it { expect(subject.provider_user_id).to_not be_nil }
    it { expect(subject.type).to eq type }
  end

  context 'uniqueness' do
    let(:provider_classroom_id) { '987' }
    let(:provider_user_id) { '123' }

    let!(:provider_classroom_user) do
      create(:provider_classroom_user,
        provider_classroom_id: provider_classroom_id,
        provider_user_id: provider_user_id,
        type: type
       )
    end

    it { expect { provider_classroom_user.dup.save!}.to raise_error ActiveRecord::RecordNotUnique }
  end
end
