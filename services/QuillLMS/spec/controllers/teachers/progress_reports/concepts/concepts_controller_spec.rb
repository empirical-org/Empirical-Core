# frozen_string_literal: true

require 'rails_helper'

describe Teachers::ProgressReports::Concepts::ConceptsController, type: :controller do
  include_context 'Concept Progress Report'

  let!(:teacher) { classroom.owner }

  it_behaves_like 'Progress Report' do
    let(:result_key) { 'concepts' }
    let(:default_filters) { { student_id: student.id } }
    let(:expected_result_count) { activity_session.concepts.size }
  end

  context 'GET #index' do
    subject { get :index, params: { student_id: student.id } }

    before { session[:user_id] = teacher.id }

    it 'assigns the student to the view' do
      subject
      expect(assigns[:student]).to be_present
    end
  end

  context 'GET #index json' do
    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }

      subject { get :index, params: { student_id: student.id }, as: :json }

      before do
        session[:user_id] = teacher.id
        Rails.cache.clear
      end

      it 'includes a list of concepts in the JSON' do
        subject
        expect(json).to have_key('concepts')
        expect(json['concepts'].size).to be > 0
      end

      it 'includes the student in the JSON' do
        subject
        expect(json).to have_key('student')
        expect(json['student']['name']).to eq(student.name)
      end

      it 'caches json response' do
        expect(controller).to receive(:json_payload).once.and_call_original

        2.times do
          subject
        end
      end

      context 'accessing another teacher\'s student data' do
        subject { get :index, params: { student_id: other_student.id }, as: :json }

        it 'raises error' do
          expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end
  end
end
