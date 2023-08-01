# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::TeachersController do
  before { allow(controller).to receive(:current_user) { teacher } }

  it { should use_before_action :authorize_owner! }
  it { should use_before_action :teacher!}

  let(:response_body) { JSON.parse(response.body).deep_symbolize_keys }
  let(:teacher) { create(:teacher, :signed_up_with_google) }

  context '#import_classrooms' do
    subject { post :import_classrooms, params: params, as: :json }

    let(:classroom_external_id1) { 123 }
    let(:classroom_external_id2) { 456 }
    let(:classroom1) { { classroom_external_id: classroom_external_id1 } }
    let(:classroom2) { { classroom_external_id: classroom_external_id2 } }

    let(:params) { { selected_classrooms: [classroom1, classroom2] } }

    it { expect { subject }.to change(teacher.google_classrooms, :count).from(0).to(2) }

    it do
      expect(GoogleIntegration::ImportTeacherClassroomsStudentsWorker).to receive(:perform_async)
      expect(GoogleIntegration::TeacherClassroomsCache).to receive(:delete).with(teacher.id)
      expect(GoogleIntegration::HydrateTeacherClassroomsCacheWorker).to receive(:perform_async).with(teacher.id)
      subject
    end

    it 'should return an array with two classrooms' do
      subject

      expect(response_body[:classrooms].pluck(:google_classroom_id))
        .to match_array [classroom_external_id1, classroom_external_id2]
    end
  end

  describe '#import_students'  do
    subject { put :import_students, params: params, as: :json }

    let(:classroom) { create(:classroom, :from_google, :with_no_teacher) }

    before { create(:classrooms_teacher, user: teacher, classroom: classroom) }

    context 'import google classroom student flow' do
      let(:params) { { classroom_id: classroom.id } }

      it 'should kick off background job that imports students' do
        expect(GoogleIntegration::TeacherClassroomsCache)
          .to receive(:delete)
          .with(teacher.id)

        expect(GoogleIntegration::ImportTeacherClassroomsStudentsWorker)
          .to receive(:perform_async)
          .with(teacher.id, [classroom.id])

        subject
      end
    end

    context 'import classes flow' do
      let(:selected_classroom_ids) { create_list(:classroom, 2).map(&:id) }
      let(:params) { { selected_classroom_ids: selected_classroom_ids} }

      it 'should kick off background job that imports students' do
        expect(GoogleIntegration::TeacherClassroomsCache)
          .to receive(:delete)
          .with(teacher.id)

        expect(GoogleIntegration::ImportTeacherClassroomsStudentsWorker)
          .to receive(:perform_async)
          .with(teacher.id, match_array(selected_classroom_ids))

        subject
      end
    end
  end

  describe '#retreive_clasrooms' do
    subject { get :retrieve_classrooms, as: :json }

    before { allow(GoogleIntegration::Classroom::Main).to receive(:pull_data) { 'google response' } }

    it do
      subject
      expect(response_body).to eq(reauthorization_required: true)
    end

    context 'user is google authorized' do
      before { allow(teacher).to receive(:google_authorized?).and_return(true) }

      it  do
        subject
        expect(response_body).to eq(quill_retrieval_processing: true)
      end

      context 'teacher classrooms cache has data' do
        let(:data) { [] }

        before { allow(GoogleIntegration::TeacherClassroomsCache).to receive(:read).and_return(data.to_json) }

        it do
          subject
          expect(response_body).to eq(classrooms: data)
        end
      end
    end
  end
end
