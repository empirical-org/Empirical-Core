# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::TeacherClassroomsCacheHydrator do
  subject { described_class.run(user) }

  let(:data) { ['classroom_data', 'classroom_data'] }

  context 'teacher has clever auth_credential' do
    let(:user) { create(:clever_library_auth_credential).user }
    let(:client) { double(:clever_client, teacher_classrooms: data) }

    it do
      expect(CleverIntegration::ClientFetcher).to receive(:run).with(user).and_return(client)
      expect(CleverIntegration::TeacherClassroomsCache).to receive(:write).with(user.id, data.to_json)
      expect(PusherTrigger).to receive(:run)

      subject
    end
  end

  context 'teacher has no auth_credential' do
    let(:user) { create(:teacher) }

    it 'does not cache any teacher classrooms and it reports an error' do
      expect(CleverIntegration::TeacherClassroomsCache).not_to receive(:write)
      expect(PusherTrigger).not_to receive(:run)
      expect(ErrorNotifier).to receive(:report)
      subject
    end
  end

  context 'teacher has google auth_credential' do
    let(:user) { create(:google_auth_credential).user }

    it 'does not cache any teacher classrooms and it reports an error' do
      expect(CleverIntegration::TeacherClassroomsCache).not_to receive(:write)
      expect(PusherTrigger).not_to receive(:run)
      expect(ErrorNotifier).to receive(:report)
      subject
    end
  end
end
