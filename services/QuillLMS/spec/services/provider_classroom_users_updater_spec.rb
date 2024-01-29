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

  context 'setting updated_at during update_all calls' do
    subject { described_class.run(classroom_external_id, [deleted_classroom_user.user_external_id], GoogleClassroomUser) }

    let(:classroom_external_id) { Faker::Number.number}

    let!(:deleted_classroom_user) { create(:google_classroom_user, :deleted, classroom_external_id:) }
    let!(:active_classroom_user) { create(:google_classroom_user, :active, classroom_external_id:) }

    before { allow(DateTime).to receive(:current).and_return(1.day.from_now) }

    it {
      expect {
        puts "before: deleted_classroom_user.updated_at: #{deleted_classroom_user.updated_at.strftime('%Y-%m-%d %H:%M:%S.%6N')}"
        Rails.logger.debug "before: deleted_classroom_user.updated_at: #{deleted_classroom_user.updated_at.strftime('%Y-%m-%d %H:%M:%S.%6N')}"
        subject
        sleep 2
        puts "after: deleted_classroom_user.updated_at: #{deleted_classroom_user.reload.updated_at.strftime('%Y-%m-%d %H:%M:%S.%6N')}"
        Rails.logger.debug "after: deleted_classroom_user.updated_at: #{deleted_classroom_user.reload.updated_at.strftime('%Y-%m-%d %H:%M:%S.%6N')}"
      }.to change { deleted_classroom_user.reload.updated_at }
    }

    it {
      expect {
        puts "before: active_classroom_user.updated_at: #{active_classroom_user.updated_at.strftime('%Y-%m-%d %H:%M:%S.%6N')}"
        Rails.logger.debug "before: active_classroom_user.updated_at: #{active_classroom_user.updated_at.strftime('%Y-%m-%d %H:%M:%S.%6N')}"
        subject
        sleep 2
        puts "after: active_classroom_user.updated_at: #{active_classroom_user.reload.updated_at.strftime('%Y-%m-%d %H:%M:%S.%6N')}"
        Rails.logger.debug "after: active_classroom_user.updated_at: #{active_classroom_user.reload.updated_at.strftime('%Y-%m-%d %H:%M:%S.%6N')}"
      }.to change { active_classroom_user.reload.updated_at }
    }
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
