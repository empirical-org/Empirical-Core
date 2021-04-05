require 'rails_helper'

describe Cms::AuthorsController, type: :controller do
  let(:user) { create(:staff) }

  before { allow(controller).to receive(:current_user) { user } }

  describe '#index' do
    let(:author) { create(:author) }
    let(:author1) { create(:author) }

    it 'should give all the authors' do
      get :index
      expect(assigns(:authors)).to include(author, author1)
    end
  end

  describe '#create' do
    let(:author) { build(:author) }

    it 'should create the author with the params given' do
      post :create, params: { author: author.attributes }
      expect(Author.last.name).to eq author.name
      expect(Author.last.avatar).to eq author.avatar
    end
  end

  describe '#edit' do
    let!(:author) { create(:author) }

    it 'should find the author' do
      get :edit, params: { id: author.id }
      expect(assigns(:author)).to eq author
    end
  end

  describe '#update' do
    let!(:author) { create(:author) }

    it 'should update the author with the params provided' do
      post :update, 
        params: { 
          id: author.id, 
          author: {
             name: "test name" 
          } 
        }

      expect(response).to redirect_to cms_authors_path
      expect(flash[:success]).to eq "Updated successfully!"
      expect(author.reload.name).to eq "test name"
    end
  end
end