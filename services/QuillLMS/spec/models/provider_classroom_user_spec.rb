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
#  canvas_instance_id    :bigint
#  classroom_external_id :string           not null
#  user_external_id      :string           not null
#
# Indexes
#
#  index_provider_classroom_users_on_canvas_instance_id  (canvas_instance_id)
#  index_provider_type_and_classroom_id_and_user_id      (type,classroom_external_id,user_external_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#
require 'rails_helper'

RSpec.describe ProviderClassroomUser, type: :model do
  let(:type) { ProviderClassroomUser::TYPES.sample }
  let(:klass) { type.constantize }
  let(:factory) { type.underscore }

  context 'attributes' do
    subject { create(factory) }

    it { expect(subject.classroom_external_id).to_not be_nil }
    it { expect(subject.user_external_id).to_not be_nil }
    it { expect(subject.type).to eq type }
  end

  context 'validations' do
    describe 'type' do
      let(:provider_classroom_user) { create(:provider_classroom_user, type: 'NotApprovedType') }

      it { expect { provider_classroom_user }.to raise_error ActiveRecord::RecordInvalid }
    end

    describe 'classroom_external_id length' do
      let(:too_long_id) { 'a' * 26 }
      let(:provider_classroom_user) { create(factory, classroom_external_id: too_long_id) }

      it { expect { provider_classroom_user }.to raise_error ActiveRecord::RecordInvalid }
    end

    describe 'user_external_id length' do
      let(:too_long_id) { 'a' * 26 }
      let(:provider_classroom_user) { create(factory, user_external_id: too_long_id) }

      it { expect { provider_classroom_user }.to raise_error ActiveRecord::RecordInvalid }
    end
  end

  context 'uniqueness' do
    let(:classroom_external_id) { '987' }
    let(:user_external_id) { '123' }

    let!(:provider_classroom_user) do
      create(factory, classroom_external_id: classroom_external_id, user_external_id: user_external_id)
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
    subject { klass.create_list(classroom_external_id, user_external_ids) }

    let(:classroom_external_id) { 'provider-classroom-id' }

    context 'zero user_external_ids' do
      let(:user_external_ids) { [] }

      it { expect { subject }.not_to change(klass, :count) }
    end

    context 'one user_external_id' do
      let(:user_external_ids) { ['a-provider-user-id'] }

      it { expect { subject }.to change(klass, :count).from(0).to(1) }
    end

    context 'two user_external_ids' do
      let(:user_external_ids) { ['a-provider-user-id', 'the-provider-user-id'] }

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
