# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'a provider classroom users updater' do
  subject { described_class.run(classroom_external_id, user_external_ids, klass) }

  let(:factory_name) { klass.name.underscore.to_sym }
  let(:classroom_external_id) { SecureRandom.hex(12) }

  context 'no provider_classroom_users exist' do
    context 'create zero records' do
      let(:user_external_ids) { [] }

      it { expect { subject }.not_to change(klass, :count) }
    end

    context 'create one record' do
      let(:user_external_ids) { ['some-provider-user-id'] }

      it { expect { subject }.to change(klass, :count).from(0).to(1) }
    end

    context 'creates two records' do
      let(:user_external_ids) { ['some-provider-user-id', 'another-provider-user-id'] }

      it { expect { subject }.to change(klass, :count).from(0).to(2) }
    end
  end

  context 'one provider_classroom_user exists' do
    let(:user_external_ids) { ['some-provider-user-id'] }

    before { create(factory_name, classroom_external_id: classroom_external_id) }

    it { expect { subject }.to change(klass, :count).from(1).to(2) }
  end

  context 'two provider_classroom_users exist' do
    TRANSITION_CONFIGS.each do |transition_config|
      user1_before = transition_config[:user1][:before]
      user2_before = transition_config[:user2][:before]
      user1_now = transition_config[:user1][:now]
      user2_now = transition_config[:user2][:now]

      it "User 1: #{user1_before} before, #{user1_now} now; User 2: #{user2_before} before, #{user2_now} now" do
        user1 = create(factory_name, user1_before, classroom_external_id: classroom_external_id)
        user2 = create(factory_name, user2_before, classroom_external_id: classroom_external_id)

        expect(user1.status).to eq user1_before
        expect(user2.status).to eq user2_before

        user_external_ids = []
        user_external_ids << user1.user_external_id if user1_now == ACTIVE
        user_external_ids << user2.user_external_id if user2_now == ACTIVE

        described_class.run(classroom_external_id, user_external_ids, klass)

        expect(user1.reload.status).to eq user1_now
        expect(user2.reload.status).to eq user2_now
      end
    end
  end
end

