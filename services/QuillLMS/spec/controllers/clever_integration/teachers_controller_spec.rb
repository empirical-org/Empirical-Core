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
      expect(CleverIntegration::TeacherClassroomsCache).to receive(:del).with(teacher.id)
      expect(CleverIntegration::HydrateTeacherClassroomsCacheWorker).to receive(:perform_async).with(teacher.id)
      request

      classrooms = JSON.parse(response.body).deep_symbolize_keys.fetch(:classrooms)

      expect(classrooms[0]).to include(classroom1_attrs.except(:students))
      expect(classrooms[1]).to include(classroom2_attrs.except(:students))
    end
  end
end
