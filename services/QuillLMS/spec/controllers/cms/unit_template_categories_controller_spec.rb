# frozen_string_literal: true

require 'rails_helper'

describe Cms::UnitTemplateCategoriesController do
  before do
    allow(controller).to receive(:current_user) { user }
  end

  it { should use_before_action :set_unit_template_category }

  let(:user) { create(:staff) }


  describe '#index' do
    let!(:category) { create(:unit_template_category) }

    it 'should assign all the unit template categories' do
      get :index
      expect(assigns(:unit_template_categories)).to include category
    end
  end

  describe '#create' do
    it 'should create the unit template category with the given params' do
      post :create, params: { unit_template_category: { name: "test", primary_color: "primary", secondary_color: "secondary" } }
      expect(UnitTemplateCategory.last.name).to eq "test"
      expect(UnitTemplateCategory.last.primary_color).to eq "primary"
      expect(UnitTemplateCategory.last.secondary_color).to eq "secondary"
    end
  end

  describe '#update' do
    let(:category) { create(:unit_template_category) }

    it 'should update the given unit template category' do
      post :update, params: { id: category.id, unit_template_category: { name: "new name" } }
      expect(category.reload.name).to eq "new name"
    end
  end

  describe '#destroy' do
    let(:category) { create(:unit_template_category) }

    it 'should destory the given category' do
      delete :destroy, params: { id: category.id }
      expect{ UnitTemplateCategory.find(category.id) }.to raise_exception ActiveRecord::RecordNotFound
    end
  end
end