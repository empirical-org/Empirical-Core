# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe TeacherClassroomsCacheHydrator do
    subject { described_class.run(user) }

    let(:data) { ['classroom_data', 'classroom_data'] }

    context 'teacher has no auth_credential' do
      let(:user) { create(:teacher) }

      it 'does not cache any teacher classrooms and it reports an error' do
        expect(TeacherClassroomsCache).not_to receive(:write)
        expect(PusherTrigger).not_to receive(:run)
        expect(ErrorNotifier).to receive(:report)
        subject
      end
    end

    context 'teacher has google auth_credential' do
      let(:user) { create(:google_auth_credential).user }
      let(:client) { double(:google_client, teacher_classrooms: data) }

      it do
        expect(ClientFetcher).to receive(:run).with(user).and_return(client)
        expect(TeacherClassroomsCache).to receive(:write).with(user.id, data.to_json)
        expect(PusherTrigger).to receive(:run)

        subject
      end
    end

    context 'teacher has canvas auth_credential' do
      let(:user) { create(:canvas_auth_credential).user }

      it 'does not cache any teacher classrooms and it reports an error' do
        expect(TeacherClassroomsCache).not_to receive(:write)
        expect(PusherTrigger).not_to receive(:run)
        expect(ErrorNotifier).to receive(:report)
        subject
      end
    end
  end
end
