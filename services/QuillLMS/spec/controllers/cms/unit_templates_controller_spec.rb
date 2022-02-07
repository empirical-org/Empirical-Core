# frozen_string_literal: true

require 'rails_helper'

describe Cms::UnitTemplatesController, type: :controller do
  let!(:staff) { create(:staff)}
  let(:parsed_body) { JSON.parse(response.body) }

  before { allow(controller).to receive(:current_user) { staff } }

  describe '#index, as: :json' do
    let!(:author) { create(:author) }
    let!(:unit_template1) { create(:unit_template, author_id: author.id) }
    let!(:unit_template2) { create(:unit_template, author_id: author.id) }

    it 'responds with list of unit_templates' do
      get :index, as: :json
      expect(parsed_body['unit_templates'].length).to eq(2)
    end
  end

  describe '#create' do
    let(:template) { build(:unit_template) }

    it 'should create the unit template category with the given params' do
      post :create, params: { unit_template: template.attributes }, as: :json
      expect(UnitTemplate.last.name).to eq template.name
      expect(UnitTemplate.last.flag).to eq template.flag
      expect(UnitTemplate.last.order_number).to eq template.order_number
    end
  end

  describe '#new' do

    let(:unit_template) { double(:unit_template) }

    before do
      allow(UnitTemplate).to receive(:new) { unit_template }
    end

    it 'should give a new criteria' do
      get :new
      expect(assigns(:unit_template)).to eq unit_template
    end
  end

  describe '#update' do
    let(:template) { create(:unit_template) }

    it 'should update the given template' do
      post :update, params: { id: template.id, unit_template: { name: "new name" } }
      expect(template.reload.name).to eq "new name"
    end
  end

  describe '#update_order_numbers' do
    let(:template) { create(:unit_template) }

    it 'should update the order number for the given unit templates' do
      put :update_order_numbers, params: { unit_templates: [{id: template.id, order_number: 47}] }
      expect(template.reload.order_number).to eq 47
    end
  end

  describe '#destroy' do
    let(:template) { create(:unit_template) }

    it 'should destroy the given unit template' do
      delete :destroy, params: { id: template.id }
      expect{ UnitTemplate.find(template.id) }.to raise_exception ActiveRecord::RecordNotFound
    end
  end
end
