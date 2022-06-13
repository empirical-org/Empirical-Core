# frozen_string_literal: true

require 'rails_helper'

describe Cms::AnnouncementsController, type: :controller do
  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :signed_in! }

  let(:user) { create(:staff) }


  describe '#index' do
    let!(:announcement) { create(:announcement) }
    let!(:announcement1) { create(:announcement) }

    it 'should give all the announcements' do
      get :index
      expect(assigns(:announcements)).to include(announcement, announcement1)
    end
  end

  describe '#create' do
    let(:announcement) { build(:announcement) }

    it 'should create the announcement with the given params' do
      post :create, params: { announcement: announcement.attributes }
      expect(flash[:success]).to eq "Announcement created successfully!"
      expect(response).to redirect_to cms_announcements_path
      expect(Announcement.last.link).to eq announcement.link
      expect(Announcement.last.text).to eq announcement.text
    end
  end

  describe '#update' do
    let!(:announcement) { create(:announcement) }

    it 'should update the announcement with the params given' do
      post :update, params: { id: announcement.id, announcement: { link: "new_link.com" } }
      expect(announcement.reload.link).to eq "new_link.com"
    end
  end
end
