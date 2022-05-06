# frozen_string_literal: true

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
      create(factory, provider_classroom_id: provider_classroom_id, provider_user_id: provider_user_id)
    end

    it { expect { provider_classroom_user.dup.save!}.to raise_error ActiveRecord::RecordNotUnique }
  end

  context 'scopes' do
    let!(:active_user) { create(factory, deleted_at: nil) }
    let!(:deleted_user) { create(factory, deleted_at: Time.current) }

    describe '.active' do
      it { expect(klass.active.to_a).to eq [active_user] }
    end

    describe '.inactive' do
      it { expect(klass.deleted.to_a).to eq [deleted_user] }
    end
  end

  context '.create_list' do
    subject { klass.create_list(provider_classroom_id, provider_user_ids) }

    let(:provider_classroom_id) { 'provider-classroom-id' }

    context 'zero provider_user_ids' do
      let(:provider_user_ids) { [] }

      it { expect { subject }.not_to change(klass, :count) }
    end

    context 'one provider_user_id' do
      let(:provider_user_ids) { ['a-provider-user-id'] }

      it { expect { subject }.to change(klass, :count).from(0).to(1) }
    end

    context 'two provider_user_ids' do
      let(:provider_user_ids) { ['a-provider-user-id', 'the-provider-user-id'] }

      it { expect { subject }.to change(klass, :count).from(0).to(2) }
    end
  end

  describe '#active?' do
    let(:active_user) { create(factory, deleted_at: nil) }

    it { expect(active_user.active?).to be true }
  end

  describe '#deleted?' do
    let(:deleted_user) { create(factory, deleted_at: Time.current) }

    it { expect(deleted_user.deleted?).to be true }
  end
end
