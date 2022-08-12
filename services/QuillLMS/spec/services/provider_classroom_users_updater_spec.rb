# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ProviderClassroomUsersUpdater do
  let(:provider_classroom_id) { '123' }
  let(:type) { ProviderClassroomUser::TYPES.sample }
  let(:klass) { type.constantize }
  let(:factory) { type.underscore }

  subject { described_class.run(factory, provider_user_ids, klass) }

  context 'no provider_classroom_users exist' do
    context 'create zero records' do
      let(:provider_user_ids) { [] }

      it { expect { subject }.not_to change(klass, :count) }
    end

    context 'create one record' do
      let(:provider_user_ids) { ['some-provider-user-id'] }

      it { expect { subject }.to change(klass, :count).from(0).to(1) }
    end

    context 'creates two records' do
      let(:provider_user_ids) { ['some-provider-user-id', 'another-provider-user-id'] }

      it { expect { subject }.to change(klass, :count).from(0).to(2) }
    end
  end

  context 'one provider_classroom_user exists' do
    let!(:user) { create(factory, provider_classroom_id: provider_classroom_id) }

    let(:provider_user_ids) { ['some-provider-user-id'] }

    it { expect { subject }.to change(klass, :count).from(1).to(2) }
  end

  context 'two provider_classroom_users exist' do
    ACTIVE = ProviderClassroomUser::ACTIVE
    DELETED = ProviderClassroomUser::DELETED

    TRANSITION_CONFIGS = [
      { user1: { before: ACTIVE, now: ACTIVE }, user2: { before: ACTIVE, now: ACTIVE } },
      { user1: { before: ACTIVE, now: ACTIVE }, user2: { before: ACTIVE, now: DELETED } },
      { user1: { before: ACTIVE, now: ACTIVE }, user2: { before: DELETED, now: ACTIVE } },
      { user1: { before: ACTIVE, now: ACTIVE }, user2: { before: DELETED, now: DELETED } },
      { user1: { before: ACTIVE, now: DELETED }, user2: { before: ACTIVE, now: DELETED } },
      { user1: { before: ACTIVE, now: DELETED }, user2: { before: DELETED, now: ACTIVE } },
      { user1: { before: ACTIVE, now: DELETED }, user2: { before: DELETED, now: ACTIVE } },
      { user1: { before: DELETED, now: ACTIVE }, user2: { before: DELETED, now: ACTIVE } },
      { user1: { before: DELETED, now: ACTIVE }, user2: { before: DELETED, now: DELETED } },
      { user1: { before: DELETED, now: DELETED }, user2: { before: DELETED, now: DELETED } }
    ]

    TRANSITION_CONFIGS.each do |transition_config|
      user1_before = transition_config[:user1][:before]
      user2_before = transition_config[:user2][:before]
      user1_now = transition_config[:user1][:now]
      user2_now = transition_config[:user2][:now]

      it "User 1: #{user1_before} before, #{user1_now} now; User 2: #{user2_before} before, #{user2_now} now" do
        user1 = create(factory, user1_before, provider_classroom_id: provider_classroom_id)
        user2 = create(factory, user2_before, provider_classroom_id: provider_classroom_id)

        expect(user1.status).to eq user1_before
        expect(user2.status).to eq user2_before

        provider_user_ids = []
        provider_user_ids << user1.provider_user_id if user1_now == ACTIVE
        provider_user_ids << user2.provider_user_id if user2_now == ACTIVE

        updater = described_class.new(provider_classroom_id, provider_user_ids, klass)
        updater.run

        user1.reload
        user2.reload

        expect(user1.status).to eq user1_now
        expect(user2.status).to eq user2_now
      end
    end
  end
end

