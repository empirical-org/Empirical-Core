require 'rails_helper'

describe Api::V1::ConceptsController, type: :controller do

  let!(:concept_name) {'Concept1'}
  let!(:parent_concept) {FactoryGirl.create(:concept)}

  def subject
    post :create, {name: concept_name, parent_uid: parent_concept.uid}
  end

  context 'OAUTH' do
    context 'POST #create' do
      it_behaves_like 'protected endpoint'
    end
  end

  context 'POST #create' do
    let!(:user) {FactoryGirl.create(:admin)}
    let!(:token) { double :acceptable? => true, :resource_owner_id => user.id }

    context 'default behavior' do

      before do
        allow(controller).to receive(:doorkeeper_token) {token}
        subject
        @parsed_body = JSON.parse(response.body)
      end

      it 'responds with 200' do
        expect(response.status).to eq(200)
      end

      it 'responds with correct keys' do
        expect(@parsed_body['concept'].keys).to match_array(%w(uid name))
      end

      it 'responds with correct values' do
        expect(@parsed_body['concept']['name']).to eq(concept_name)
        expect(@parsed_body['concept']['uid']).to_not be_nil
      end
    end
  end
end
