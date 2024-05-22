# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'a provider classroom user' do
  let(:factory_name) { described_class.to_s.underscore }

  it { expect(subject.classroom_external_id).to_not be_nil }
  it { expect(subject.user_external_id).to_not be_nil }
  it { expect(subject.type).to eq described_class.to_s }

  context 'validations' do
    describe 'classroom_external_id length' do
      subject { create(factory_name, classroom_external_id: too_long_id) }

      let(:too_long_id) { 'a' * 26 }

      it { expect { subject }.to raise_error ActiveRecord::RecordInvalid }
    end

    describe 'user_external_id length' do
      subject { create(factory_name, user_external_id: too_long_id) }

      let(:too_long_id) { 'a' * 26 }

      it { expect { subject }.to raise_error ActiveRecord::RecordInvalid }
    end
  end

  context 'uniqueness' do
    it { expect { subject.dup.save!}.to raise_error ActiveRecord::RecordNotUnique }
  end

  context 'scopes' do
    let!(:active_user) { create(factory_name, deleted_at: nil) }
    let!(:deleted_user) { create(factory_name, deleted_at: Time.current) }

    describe '.active' do
      it { expect(described_class.active.to_a).to eq [active_user] }
    end

    describe '.inactive' do
      it { expect(described_class.deleted.to_a).to eq [deleted_user] }
    end
  end

  context '.create_list' do
    subject { described_class.create_list(classroom_external_id, user_external_ids) }

    let(:classroom_external_id) { 'provider-classroom-id' }

    context 'zero user_external_ids' do
      let(:user_external_ids) { [] }

      it { expect { subject }.not_to change(described_class, :count) }
    end

    context 'one user_external_id' do
      let(:user_external_ids) { ['a-provider-user-id'] }

      it { expect { subject }.to change(described_class, :count).from(0).to(1) }
    end

    context 'two user_external_ids' do
      let(:user_external_ids) { ['a-provider-user-id', 'the-provider-user-id'] }

      it { expect { subject }.to change(described_class, :count).from(0).to(2) }
    end
  end

  describe '#active?' do
    let(:active_user) { create(factory_name, deleted_at: nil) }

    it { expect(active_user.active?).to be true }
  end

  describe '#deleted?' do
    let(:deleted_user) { create(factory_name, deleted_at: Time.current) }

    it { expect(deleted_user.deleted?).to be true }
  end
end

