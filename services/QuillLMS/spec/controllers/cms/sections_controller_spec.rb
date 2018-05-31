require 'rails_helper'

describe Cms::SectionsController do
  it { should use_before_action :set_section }

  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    let!(:section) { create(:section) }

    it 'should assing the sections' do
      get :index
      expect(assigns(:sections)).to include section
    end
  end

  describe '#create' do
    it 'should create the section with the params given' do
      post :create, section: { name: "test", position: 2 }
      expect(Section.last.name).to eq "test"
      expect(Section.last.position).to eq 2
      expect(response).to redirect_to cms_sections_url
    end
  end

  describe  '#update' do
    let!(:section) { create(:section) }

    it 'should update the given section' do
      post :update, id: section.id, section: { name: "new name" }
      expect(section.reload.name).to eq "new name"
    end
  end

  describe '#destroy' do
    let!(:section) { create(:section) }

    it 'should destroy the given section' do
      delete :destroy, id: section.id
      expect{Section.find(section.id)}.to raise_exception ActiveRecord::RecordNotFound
    end
  end
end