# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::ConceptsController, type: :controller do
  let(:user) { create(:user) }
  let(:parsed_body) { JSON.parse(response.body) }

  before { allow(controller).to receive(:current_user) { user } }

  context 'POST #create' do
    subject { post :create, params: { concept: { name: concept_name, parent_uid: parent_concept.uid } }, as: :json }

    let!(:concept_name) { 'Concept1' }
    let!(:parent_concept) { create(:concept) }

    it { expect { subject }.not_to change(Concept, :count) }
    it { expect(subject).to have_http_status(:see_other) }

    context 'as staff' do
      let(:user) { create(:staff) }

      before { subject }

      it { expect(response).to have_http_status(:ok) }
      it { expect(parsed_body['concept'].keys).to match_array(%w(id uid name parent_id)) }
      it { expect(parsed_body['concept']['name']).to eq concept_name }
      it { expect(parsed_body['concept']['uid']).to_not be_nil }
    end

    describe 'cache actions' do
      let(:user) { create(:staff) }

      it 'expires the redis cache for all concepts, each time a new concept is created' do
        expect($redis).to receive(:del).with(Concept::ALL_CONCEPTS_KEY)
        subject
      end
    end
  end

  context 'GET #index' do
    subject { get :index, as: :json }

    let!(:concept1) { create(:concept) }
    let!(:concept2) { create(:concept, parent: concept1) }

    it 'returns all concepts' do
      subject
      expect(parsed_body['concepts'].length).to eq(2)
    end

    it 'sets the redis cache for all concepts if not set already' do
      $redis.del(Concept::ALL_CONCEPTS_KEY)
      subject
      expect($redis.get(Concept::ALL_CONCEPTS_KEY)).to eq({ concepts: Concept.all_with_level }.to_json)
    end
  end

  context 'GET #level_zero_concepts_with_lineage' do
    subject { get :level_zero_concepts_with_lineage }

    let!(:concept1) { create(:concept, name: 'Articles', visible: true) }
    let!(:concept2) { create(:concept, name: 'The', parent: concept1) }
    let!(:concept3) { create(:concept, name: 'Something', parent: concept2) }
    let!(:concept4) { create(:concept, name: 'Different', visible: true) }
    let!(:concept5) { create(:concept, name: 'Name', parent: concept4) }
    let!(:concept6) { create(:concept, name: 'Other', parent: concept5) }
    let!(:concept7) { create(:concept, name: 'Different', visible: false) }

    before { subject }

    it 'returns a row for each level 0 concept that has visible set to true' do
      expect(parsed_body['concepts'].length).to eq(2)
    end

    it 'returns them in alphabetical order and formats the names correctly' do
      expect(parsed_body['concepts'][0]['name']).to eq('Articles | The | Something')
      expect(parsed_body['concepts'][1]['name']).to eq('Different | Name | Other')
    end
  end
end
