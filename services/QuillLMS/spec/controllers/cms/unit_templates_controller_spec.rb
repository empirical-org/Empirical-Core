# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Cms::UnitTemplatesController, type: :controller do
  let!(:staff) { create(:staff)}
  let(:parsed_body) { JSON.parse(response.body) }

  before { allow(controller).to receive(:current_user) { staff } }

  describe '#index, as: :json' do
    subject { get :index, as: :json }

    let!(:author) { create(:author) }
    let!(:unit_template1) { create(:unit_template, author_id: author.id) }
    let!(:unit_template2) { create(:unit_template, author_id: author.id) }

    it 'responds with list of unit_templates' do
      subject
      expect(parsed_body['unit_templates'].length).to eq(2)
    end
  end

  describe '#create' do
    subject { post :create, params:, as: :json }

    let(:unit_template) { build(:unit_template) }
    let(:activities) { create_list(:activity, 3) }
    let(:activity_ids) { activities.map(&:id) }
    let(:params) { { unit_template: unit_template.attributes.merge(activity_ids:) } }

    it 'should create the unit template with the given params' do
      expect { subject }.to change(UnitTemplate, :count).by(1)

      expect(UnitTemplate.last.name).to eq unit_template.name
      expect(UnitTemplate.last.flag).to eq unit_template.flag
    end

    it 'should create associated ActivitiesUnitTemplate records' do
      expect { subject }.to change(ActivitiesUnitTemplate, :count).by(activities.count)

      activities.each_with_index do |activity, order_number|
        activities_unit_template = ActivitiesUnitTemplate.find_by(activity:, unit_template: UnitTemplate.last)
        expect(activities_unit_template.order_number).to eq order_number
      end
    end
  end

  describe '#new' do
    subject { get :new }

    let(:unit_template) { double(:unit_template) }

    before { allow(UnitTemplate).to receive(:new) { unit_template } }

    it 'should give a new criteria' do
      subject
      expect(assigns(:unit_template)).to eq unit_template
    end
  end

  describe '#update' do
    subject { post :update, params:, as: :json }

    let(:unit_template) { create(:unit_template) }

    let(:params) do
      {
        id: unit_template.id,
        unit_template: {
          name: 'new name',
          activity_ids: new_activities.map(&:id)
        }
      }
    end

    let(:old_activities) { create_list(:activity, 2) }
    let(:new_activities) { create_list(:activity, 3) }

    before do
      old_activities.each_with_index do |activity, order_number|
        ActivitiesUnitTemplate.create(activity:, unit_template:, order_number:)
      end
    end

    it 'should update the given template' do
      subject
      expect(unit_template.reload.name).to eq 'new name'
    end

    it 'should update associated ActivitiesUnitTemplate records' do
      expect { subject }.to change(ActivitiesUnitTemplate, :count).by(new_activities.count - old_activities.count)

      new_activities.each_with_index do |activity, order_number|
        activities_unit_template = ActivitiesUnitTemplate.find_by(activity:, unit_template:)
        expect(activities_unit_template.order_number).to eq order_number
      end

      old_activities.each do |activity|
        expect(ActivitiesUnitTemplate.exists?(activity:, unit_template:)).to be false
      end
    end
  end

  describe '#update_order_numbers' do
    subject { put :update_order_numbers, params:, as: :json }

    let(:params) { { unit_templates: [{id: unit_template.id, order_number: 47}] } }

    let(:unit_template) { create(:unit_template) }

    it 'should update the order number for the given unit templates' do
      subject
      expect(unit_template.reload.order_number).to eq 47
    end
  end

  describe '#destroy' do
    subject { delete :destroy, params:, as: :json }

    let(:params) { { id: unit_template.id } }
    let(:unit_template) { create(:unit_template) }

    it 'should destroy the given unit template' do
      delete :destroy, params: { id: unit_template.id }
      expect{ UnitTemplate.find(unit_template.id) }.to raise_exception ActiveRecord::RecordNotFound
    end
  end
end
