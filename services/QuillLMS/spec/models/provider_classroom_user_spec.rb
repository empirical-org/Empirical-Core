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

RSpec.describe ProviderClassroomUser, type: :model do
  let(:type) { ProviderClassroomUser::TYPES.sample }
  let(:klass) { type.constantize }
  let(:factory) { type.underscore }

  context 'attributes' do
    subject { create(factory) }

    it { expect(subject.provider_classroom_id).to_not be_nil }
    it { expect(subject.provider_user_id).to_not be_nil }
    it { expect(subject.type).to eq type }
  end

  context 'validations' do
    describe 'type' do
      let(:provider_classroom_user) { create(:provider_classroom_user, type: 'NotApprovedType') }

      it { expect { provider_classroom_user }.to raise_error ActiveRecord::RecordInvalid }
    end

    describe 'provider_classroom_id length' do
      let(:too_long_id) { 'a' * 26 }
      let(:provider_classroom_user) { create(factory, provider_classroom_id: too_long_id) }

      it { expect { provider_classroom_user }.to raise_error ActiveRecord::RecordInvalid }
    end

    describe 'provider_user_id length' do
      let(:too_long_id) { 'a' * 26 }
      let(:provider_classroom_user) { create(factory, provider_user_id: too_long_id) }

      it { expect { provider_classroom_user }.to raise_error ActiveRecord::RecordInvalid }
    end
  end

  context 'uniqueness' do
    let(:provider_classroom_id) { '987' }
    let(:provider_user_id) { '123' }

    let!(:provider_classroom_user) do
      create(factory,
        provider_classroom_id: provider_classroom_id,
        provider_user_id: provider_user_id,
        type: type
       )
    end

    it { expect { provider_classroom_user.dup.save!}.to raise_error ActiveRecord::RecordNotUnique }
  end
end
