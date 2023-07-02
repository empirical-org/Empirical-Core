# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::TeachersController do
  before { allow(controller).to receive(:current_user) { teacher } }

  let(:response_body) { JSON.parse(response.body).deep_symbolize_keys }
  let(:teacher) { create(:teacher, :signed_up_with_google) }

  describe '#retreive_clasrooms' do
    subject { get :retrieve_classrooms, as: :json }

    before { allow(GoogleIntegration::Classroom::Main).to receive(:pull_data) { 'google response' } }

    it do
      subject
      expect(response_body).to eq(user_id: teacher.id, reauthorization_required: true)
    end

    context 'user is google authorized' do
      before { allow(teacher).to receive(:google_authorized?).and_return(true) }

      it  do
        subject
        expect(response_body).to eq({ user_id: teacher.id, quill_retrieval_processing: true })
      end

      context 'teacher classrooms cache has data' do
        let(:data) { { classrooms: [] } }

        before { allow(GoogleIntegration::TeacherClassroomsCache).to receive(:read).and_return(data.to_json) }

        it do
          subject
          expect(response_body).to eq data
        end
      end

    end
  end
end
