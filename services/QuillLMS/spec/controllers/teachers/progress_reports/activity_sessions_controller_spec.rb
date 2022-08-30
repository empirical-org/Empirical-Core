# frozen_string_literal: true

require 'rails_helper'

describe Teachers::ProgressReports::ActivitySessionsController, type: :controller do
  let(:teacher) { create(:teacher) }

  include_context 'Standard Progress Report'
  it_behaves_like 'Progress Report' do
    let(:default_filters) { {page: 1} }
    let(:result_key) { 'activity_sessions' }
    let(:expected_result_count) { visible_activity_sessions.size }

    it_behaves_like "filtering progress reports by Unit" do
      let(:filter_value) { empty_unit.id }
      let(:expected_result_count) { 0 }
    end
  end

  context 'XHR GET #index' do
    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }

      before { session[:user_id] = teacher.id }

      it 'includes the serialized data for activity sessions' do
        get :index, params: { page: 1 }, as: :json
        expect(json['activity_sessions'][0]['activity_classification_name']).to_not be_nil
      end

      it 'includes the number of pages of results' do
        get :index, params: { page: 1 }, as: :json
        expect(json['page_count']).to eq(1)
      end

      it 'can filter by classroom' do
        get :index, params: { classroom_id: empty_classroom.id, page: 1}, as: :json
        expect(json['activity_sessions'].size).to eq(0)
        expect(json['students'].size).to eq(0)
      end

      it 'can filter by student' do
        get :index, params: { student_id: zojirushi.id, page: 1 }, as: :json
        expect(json['activity_sessions'].size).to eq(1)
      end

      it 'fetches classroom and student data for the filter options' do
        get :index, params: { page: 1, classroom_id: full_classroom.id }, as: :json
        expect(json['classrooms']).to eq(teacher.ids_and_names_of_affiliated_classrooms)
        expect(json['students']).to eq(teacher.ids_and_names_of_affiliated_students(full_classroom.id))
        expect(json['units']).to eq(teacher.ids_and_names_of_affiliated_units)
      end

      it 'renders the same data fresh and from cache' do
        expect(controller).to receive(:return_data).with(any_args).once.and_call_original
        2.times do
          get :index, params: { page: 1 }, as: :json
          expect(response.status).to eq(200)
          expect(json['activity_sessions'][0]['activity_classification_name']).to_not be_nil
        end
      end
    end
  end

end
