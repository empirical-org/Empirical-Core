# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeachersController do
  include_context 'Clever Library Classrooms Data'

  let(:teacher) { create(:teacher, :signed_up_with_clever) }

  before { allow(controller).to receive(:current_user) { teacher } }

  context '#import_classrooms' do
    let(:params) { { selected_classrooms: [classroom1_attrs, classroom2_attrs] } }
    let(:request) { post :import_classrooms, params: params, as: :json }

    it { expect { request }.to change(teacher.clever_classrooms, :count).from(0).to(2) }

    it 'should return an array with two classrooms' do
      expect(CleverIntegration::TeacherClassroomsCache).to receive(:delete).with(teacher.id)
      expect(CleverIntegration::HydrateTeacherClassroomsCacheWorker).to receive(:perform_async).with(teacher.id)
      request

      classrooms = JSON.parse(response.body).deep_symbolize_keys.fetch(:classrooms)

      expect(classrooms[0]).to include(classroom1_attrs.except(:students))
      expect(classrooms[1]).to include(classroom2_attrs.except(:students))
    end
  end

  context '#import_students'  do
    let(:classroom) { create(:classroom, :from_clever, :with_no_teacher) }
    let(:selected_classroom_ids) { [classroom.id] }
    let(:params) { { selected_classroom_ids: selected_classroom_ids} }
    let(:request) { put :import_students, params: params, as: :json }

    before { create(:classrooms_teacher, user: teacher, classroom: classroom) }

    it 'should kick off background job that imports students' do
      expect(CleverIntegration::TeacherClassroomsCache).to receive(:delete).with(teacher.id)

      expect(CleverIntegration::ImportClassroomStudentsWorker)
        .to receive(:perform_async)
        .with(teacher.id, selected_classroom_ids)

      request
    end
  end
end
