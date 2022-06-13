require 'rails_helper'
require 'modules/response_search'

RSpec.describe 'Response model multi-db configuration checks', type: :request do
  let(:q_response) { create(:response) }
  let(:question_uid) { q_response.question_uid }

  before { allow(Pusher::Client).to receive(:new) { double(:client, trigger: true) } }

  before { allow_any_instance_of(ResponseSearch).to receive(:search_responses).and_return({}) }

  before { allow(RematchResponsesForQuestionWorker).to receive(:perform_in) }

  before { allow(CreateOrIncrementResponseWorker).to receive(:perform_async) }

  before { http_request }

  context 'GET' do
    let(:http_request) { get url }

    describe 'responses#show' do
      let(:url) { "/responses/#{q_response.id}" }

      it { should_only_read_from_replica }
    end

    describe 'responses#responses_for_question' do
      let(:url) { "/questions/#{question_uid}/responses"}

      it { should_only_read_from_replica }
    end

    describe 'responses#multiple_choice_options' do
      let(:url) { "/questions/#{question_uid}/multiple_choice_options" }

      it { should_only_read_from_replica }
    end

    describe 'responses#health_of_question' do
      let(:url) { "/questions/#{question_uid}/health" }

      it { should_only_read_from_replica }
    end

    describe 'responses#incorrect_sequences' do
      let(:url) { "/responses/#{question_uid}/incorrect_sequences" }

      it { should_only_read_from_replica }
    end

    describe 'responses#grade_breakdown' do
      let(:url) { "/questions/#{question_uid}/grade_breakdown" }

      it { should_only_read_from_replica }
    end
  end

  context 'POST' do
    let(:http_request) { post url, params: params }

    describe 'responses#create' do
      let(:params) { { response: attributes_for(:response) } }
      let(:url) { '/responses' }

      it { should_only_write_to_primary }
    end

    describe 'responses#show_many' do
      let(:url) { '/responses/mass_edit/show_many' }
      let(:params) { { responses: [q_response.id] } }

      it { should_only_write_to_primary }
    end

    describe 'responses#delete_many' do
      let(:params) { { ids: [q_response.id] } }
      let(:url) { '/responses/mass_edit/delete_many' }

      it { should_only_write_to_primary }
    end

    describe 'responses#count_affected_by_incorrect_sequences' do
      let(:params) { { question_uid: question_uid, data: { selected_sequences: ['123'] } } }
      let(:url) { "/responses/#{question_uid}/incorrect_sequence_affected_count" }

      it { should_only_write_to_primary }
    end

    describe 'responses#count_affected_by_focus_points' do
      let(:params) { { question_uid: question_uid, data: { selected_sequences: ['1234']}} }
      let(:url) { "/responses/#{question_uid}/focus_point_affected_count" }

      it { should_only_write_to_primary }
    end

    describe 'responses#search' do
      let(:search_params) { { pageNumber: 1, text: '1234', sort: { column: :text} } }

      let(:params) { { question_uid: question_uid, search: search_params } }
      let(:url) { "/questions/#{question_uid}/responses/search" }

      it { should_only_write_to_primary }
    end

    describe 'responses#batch_responses_for_lesson' do
      let(:params) { { question_uids: [question_uid]} }
      let(:url) { '/responses/batch_responses_for_lesson' }

      it { should_only_write_to_primary }
    end

    describe 'responses#clone_responses' do
      let(:params) { { original_question_uid: question_uid, new_question_uid: question_uid} }
      let(:url) { '/responses/clone_responses' }

      it { should_only_write_to_primary }
    end

    describe 'responses#create_or_increment' do
      let(:params) { { response: attributes_for(:response) } }
      let(:url) { '/responses/create_or_increment' }

      it { should_only_write_to_primary }
    end

    describe 'responses#rematch_all_responses_for_question' do
      let(:params) { { uid: q_response.uid, type: :type } }
      let(:url) { '/responses/rematch_all' }

      it { should_only_write_to_primary }
    end
  end

  context 'PUT' do
    let(:http_request) { put url, params: params }

    describe 'responses#update' do
      let(:params) { { response: attributes_for(:response) } }
      let(:url) { "/responses/#{q_response.id}" }

      it { should_only_write_to_primary }
    end

    describe 'responses#edit_many' do
      let(:params) { { updated_attribute: { text: 'new text' } } }
      let(:url) { '/responses/mass_edit/edit_many' }

      it { should_only_write_to_primary }
    end

    describe 'responses#reindex_responses_updated_today_for_given_question' do
      let(:params) { { } }
      let(:url) { "/question/#{question_uid}/reindex_responses_updated_today_for_given_question" }

      it { should_only_write_to_primary }
    end

    describe 'responses#replace_concept_uids' do
      let(:params) { { response: { original_concept_uid: '123', new_concept_uid: '321' } } }
      let(:url)  { '/responses/replace_concept_uids' }

      it { should_only_write_to_primary }
    end
  end

  context 'PATCH' do
    let(:http_request) { patch url, params: params }

    describe 'responses#update' do
      let(:params) { { response: attributes_for(:response) } }
      let(:url) { "/responses/#{q_response.id}" }

      it { should_only_write_to_primary }
    end
  end

  context 'DELETE' do
    let(:http_request) { delete url }

    describe 'responses#destroy' do
      let(:url) { "/responses/#{q_response.id}" }

      it { should_only_write_to_primary }
    end
  end

  def should_only_read_from_replica
    expect(db_selection_methods).to eq [:read_from_replica]
  end

  def should_only_write_to_primary
    expect(db_selection_methods).to eq [:write_to_primary]
  end

  def db_selection_methods
    request.session[:db_selection_methods]
  end
end
