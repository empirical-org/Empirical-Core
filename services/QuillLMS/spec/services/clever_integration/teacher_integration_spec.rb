# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherIntegration do
  include_context 'Clever Teacher auth_hash'

  subject { described_class.run(auth_hash) }

  let(:info_hash) { auth_hash.info }
  let(:teacher_data) { double(:teacher_data) }

  context 'library integration' do
    let(:auth_hash) { library_auth_hash }

    it do
      expect(CleverIntegration::TeacherDataAdapter).to receive(:run).with(info_hash).and_return(teacher_data)
      expect(CleverIntegration::TeacherImporter).to receive(:run).with(teacher_data).and_return(teacher)
      expect(CleverIntegration::LibraryTeacherIntegration).to receive(:run).with(teacher, auth_hash.credentials.token)
      expect(CleverIntegration::TeacherClassroomsCacheHydrator).to receive(:run).with(teacher.id)
      expect(CleverIntegration::TeacherImportedClassroomsUpdater).to receive(:run).with(teacher.id)

      expect(subject).to eq user_success(teacher)
    end

    context 'nil email' do
      let(:email) { nil }
      let(:message) { CleverIntegration::TeacherDataAdapter::BlankEmailError::MESSAGE }

      it { expect(subject).to eq user_failure(message) }
    end
  end

  context 'district integration' do
    let(:auth_hash) { district_auth_hash }

    it do
      expect(CleverIntegration::TeacherDataAdapter).to receive(:run).with(info_hash).and_return(teacher_data)
      expect(CleverIntegration::TeacherImporter).to receive(:run).with(teacher_data).and_return(teacher)
      expect(CleverIntegration::DistrictTeacherIntegration).to receive(:run).with(teacher, district.clever_id)
      expect(CleverIntegration::TeacherClassroomsCacheHydrator).to receive(:run).with(teacher.id)
      expect(CleverIntegration::TeacherImportedClassroomsUpdater).to receive(:run).with(teacher.id)

      expect(subject).to eq user_success(teacher)
    end

    context 'nil district' do
      let(:message) { CleverIntegration::DistrictTeacherIntegration::NilDistrictError::MESSAGE }

      before { expect(CleverIntegration::Importers::CleverDistrict).to receive(:run).and_return(nil) }

      it { expect(subject).to eq user_failure(message) }
    end
  end

  def user_failure(message)
    { type: 'user_failure', data: "Error: #{message}" }
  end

  def user_success(teacher)
    { type: 'user_success', data: teacher }
  end
end
