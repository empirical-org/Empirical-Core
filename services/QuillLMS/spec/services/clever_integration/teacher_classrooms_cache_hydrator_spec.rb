# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::TeacherClassroomsCacheHydrator do
  let(:raw_data) { ['classroom_data', 'classroom_data'] }
  let(:data) { { classrooms: raw_data }}

  subject { described_class.run(teacher.id) }

  context 'teacher has clever auth_credential' do
    let(:teacher) { create(:teacher, :signed_up_with_clever) }
    let!(:auth_credential) { create(:clever_library_auth_credential, user: teacher) }
    let(:client) { double(:clever_client, get_teacher_classrooms: raw_data) }

    it do
      expect(CleverIntegration::ClientFetcher).to receive(:run).with(teacher).and_return(client)
      expect(CleverIntegration::TeacherClassroomsCache).to receive(:write).with(teacher.id, data.to_json)
      expect(PusherTrigger).to receive(:run)

      subject
    end
  end

  context 'teacher has no auth_credential' do
    let(:teacher) { create(:teacher) }

    it 'does not cache any teacher classrooms and it reports an error' do
      expect(CleverIntegration::TeacherClassroomsCache).not_to receive(:write)
      expect(PusherTrigger).not_to receive(:run)
      expect(ErrorNotifier).to receive(:report)
      subject
    end
  end

  context 'teacher has google auth_credential' do
    let(:teacher) { create(:teacher, :signed_up_with_google) }

    it 'does not cache any teacher classrooms and it reports an error' do
      expect(CleverIntegration::TeacherClassroomsCache).not_to receive(:write)
      expect(PusherTrigger).not_to receive(:run)
      expect(ErrorNotifier).to receive(:report)
      subject
    end
  end
end
