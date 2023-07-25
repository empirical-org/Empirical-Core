# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeachersController do
  include_context 'Clever Library Classrooms Data'

  let(:teacher) { create(:teacher, :signed_up_with_clever) }
  let(:response_body) { JSON.parse(response.body).deep_symbolize_keys }

  before { allow(controller).to receive(:current_user) { teacher } }

  it { should use_before_action :authorize_owner! }
  it { should use_before_action :teacher! }

  describe '#import_classrooms' do
    subject { post :import_classrooms, params: params, as: :json }

    let(:selected_classrooms) { [classroom1_attrs, classroom2_attrs] }
    let(:params) { { selected_classrooms: selected_classrooms } }

    it { expect { subject }.to change(teacher.reload.clever_classrooms, :count).from(0).to(2) }

    it 'should call call a couple workers and cache teacher classrooms' do
      expect(CleverIntegration::ImportTeacherClassroomsStudentsWorker).to receive(:perform_async)
      expect(CleverIntegration::TeacherClassroomsCache).to receive(:delete).with(teacher.id)
      expect(CleverIntegration::HydrateTeacherClassroomsCacheWorker).to receive(:perform_async).with(teacher.id)
      subject
    end
  end

  describe '#import_students'  do
    subject { put :import_students, params: params, as: :json }

    let(:classroom) { create(:classroom, :from_clever, :with_no_teacher) }

    before { create(:classrooms_teacher, user: teacher, classroom: classroom) }

    context 'import clever classroom student flow' do
      let(:params) { { classroom_id: classroom.id } }

      it 'should kick off background job that imports students' do
        expect(CleverIntegration::TeacherClassroomsCache)
          .to receive(:delete)
          .with(teacher.id)

        expect(CleverIntegration::ImportTeacherClassroomsStudentsWorker)
          .to receive(:perform_async)
          .with(teacher.id, [classroom.id])

        subject
      end
    end

    context 'import classes flow' do
      let(:selected_classroom_ids) { create_list(:classroom, 2).map(&:id) }
      let(:params) { { selected_classroom_ids: selected_classroom_ids} }

      it 'should kick off background job that imports students' do
        expect(CleverIntegration::TeacherClassroomsCache)
          .to receive(:delete)
          .with(teacher.id)

        expect(CleverIntegration::ImportTeacherClassroomsStudentsWorker)
          .to receive(:perform_async)
          .with(teacher.id, match_array(selected_classroom_ids))

        subject
      end
    end
  end

  describe '#retrieve_classrooms' do
    subject { get :retrieve_classrooms, as: :json }

    let(:classroom) { create(:classroom, :from_clever, :with_no_teacher) }

    before { create(:classrooms_teacher, user: teacher, classroom: classroom) }

    context 'user is not clever authorized' do
      it do
        subject
        expect(response_body).to eq({ user_id: teacher.id, reauthorization_required: true })
      end
    end

    context 'user is clever authorized' do
      before { expect(teacher).to receive(:clever_authorized?).and_return(true) }

      it  do
        subject
        expect(response_body).to eq({ user_id: teacher.id, quill_retrieval_processing: true })
      end

      context 'teacher classrooms cache has data' do
        let(:data) { { classrooms: [] } }

        before { CleverIntegration::TeacherClassroomsCache.write(teacher.id, data.to_json)}

        it  do
          subject
          expect(response_body).to eq data
        end
      end
    end
  end
end
