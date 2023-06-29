# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::TeacherClassroomsCacheHydrator do
  let(:classrooms) { ['classroom_data'] }
  let(:data) { { classrooms: classrooms, canvas_instance_id: canvas_instance&.id }}

  subject { described_class.run(user) }

  context 'teacher has canvas_auth_credential' do
    let(:user) { create(:teacher, :with_canvas_account) }
    let(:canvas_auth_credential) { create(:canvas_auth_credential, user: user) }
    let(:canvas_instance) { canvas_auth_credential.canvas_instance }
    let(:client) { double(:canvas_client, teacher_classrooms: data) }

    it do
      expect(CanvasIntegration::RestClient)
        .to receive(:new)
        .with(canvas_auth_credential)
        .and_return(client)

      expect(CanvasIntegration::TeacherClassroomsCache)
        .to receive(:write)
        .with(user.id, data.to_json)

      subject
    end
  end

  context 'teacher has no auth_credential' do
    let(:user) { create(:teacher) }
    let(:error_class) { CanvasIntegration::ClientFetcher::NilCanvasAuthCredentialError }

    it 'does not cache any teacher classrooms and it reports an error' do
      expect(CanvasIntegration::TeacherClassroomsCache).not_to receive(:write)
      expect(PusherTrigger).not_to receive(:run)
      expect(ErrorNotifier).to receive(:report).with(error_class, user_id: user.id)
      subject
    end
  end

  context 'teacher has google auth_credential' do
    let(:user) { create(:teacher, :signed_up_with_google) }
    let(:error_class) { CanvasIntegration::ClientFetcher::NilCanvasAuthCredentialError }

    it 'does not cache any teacher classrooms and it reports an error' do
      expect(CanvasIntegration::TeacherClassroomsCache).not_to receive(:write)
      expect(PusherTrigger).not_to receive(:run)
      expect(ErrorNotifier).to receive(:report).with(error_class, user_id: user.id)
      subject
    end
  end
end
