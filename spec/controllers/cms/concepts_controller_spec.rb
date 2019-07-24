require 'rails_helper'

describe Cms::ConceptsController do
  let!(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#new' do
    let!(:level2_concept) { create(:concept) }

    before do
      level2_concept.update(parent_id: nil)
    end

    it 'should assign the level 2 concepts and concepts' do
      get :new
      expect(assigns(:level_2_concepts)).to include level2_concept
      expect(assigns(:concepts)).to include ["#{level2_concept.name} - Level 2", level2_concept.id]
    end
  end

  describe '#create' do
    it 'should create the concept with the params given' do
      post :create, concept: { name: "test name", parent_id: 42 }
      expect(Concept.last.name).to eq "test name"
      expect(Concept.last.parent_id).to eq 42
    end
  end
end