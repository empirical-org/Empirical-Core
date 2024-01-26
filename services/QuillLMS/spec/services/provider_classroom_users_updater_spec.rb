# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ProviderClassroomUsersUpdater do
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

  context 'setting update_at during update_all calls' do
    subject { described_class.run(classroom_external_id, [deleted_classroom_user.user_external_id], GoogleClassroomUser) }

    let(:classroom_external_id) { Faker::Number.number}
    let(:deleted_classroom_user) { create(:google_classroom_user, :deleted, classroom_external_id: classroom_external_id) }
    let(:active_classroom_user) { create(:google_classroom_user, :active, classroom_external_id: classroom_external_id) }

    it do
      expect { subject }
        .to change_after_waiting { deleted_classroom_user.reload.updated_at }
        .and change_after_waiting { active_classroom_user.reload.updated_at }
    end
  end

  context 'canvas' do
    let(:klass) { CanvasClassroomUser }
    let(:classroom_external_id) do
      CanvasClassroom.build_classroom_external_id(create(:canvas_instance).id, Faker::Number.number)
    end

    it_behaves_like 'a provider classroom users updater'
  end

  context 'when classroom is from clever' do
    let(:classroom_external_id) { SecureRandom.hex(12) }
    let(:klass) { CleverClassroomUser }

    it_behaves_like 'a provider classroom users updater'
  end

  context 'when classroom is from canvas' do
    let(:classroom_external_id) { Faker::Number.number}
    let(:klass) { GoogleClassroomUser }

    it_behaves_like 'a provider classroom users updater'
  end
end
