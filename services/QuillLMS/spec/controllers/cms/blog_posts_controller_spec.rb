# frozen_string_literal: true

require 'rails_helper'

describe Cms::BlogPostsController, type: :controller do
  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :set_blog_post }
  it { should use_before_action :authors }
  it { should use_before_action :topics }

  let(:user) { create(:staff) }


  describe '#index' do
    let!(:post) { create(:blog_post) }

    before do
      allow_any_instance_of(BlogPost).to receive(:attributes) { {} }
    end

    it 'should set the blog posts name and id and topics' do
      get :index
      expect(assigns(:blog_posts_name_and_id).first).to include({'rating' => post.average_rating})
      expect(assigns(:topics)).to eq(BlogPost::TOPICS)
    end
  end

  describe '#create' do
    let(:bpost) { build(:blog_post) }

    it 'should create the blog post with the params given' do
      post :create, params: { blog_post: bpost.attributes }, as: :json
      expect(BlogPost.last.body).to eq bpost.body
      expect(BlogPost.last.title).to eq bpost.title
      expect(BlogPost.last.topic).to eq bpost.topic
      expect(BlogPost.last.read_count).to eq bpost.read_count
      expect(BlogPost.last.draft).to eq bpost.draft
      expect(BlogPost.last.premium).to eq bpost.premium
      expect(BlogPost.last.external_link).to eq bpost.external_link
    end
  end

  describe '#update' do
    let!(:bpost) { create(:blog_post) }

    it 'should update the given blog post' do
      post :update, params: { id: bpost.id, blog_post: { title: "new test title" } }
      expect(bpost.reload.title).to eq "new test title"
    end
  end

  describe '#destroy' do
    let!(:bpost) { create(:blog_post) }

    it 'should destroy the given blog post' do
      delete :destroy, params: { id: bpost.id }
      expect{BlogPost.find(bpost.id)}.to raise_exception(ActiveRecord::RecordNotFound)
    end
  end

  describe '#unpublish' do
    let!(:bpost) { create(:blog_post) }

    it 'should make draft true in the given blog post' do
      get :unpublish, params: { id: bpost.id }
      expect(bpost.reload.draft).to eq true
      expect(flash[:success]).to eq "Blog post successfully set to draft."
      expect(response).to redirect_to cms_blog_posts_path
    end
  end

  describe '#update_order_numbers' do
    let!(:bpost) { create(:blog_post) }
    let!(:bpost1) { create(:blog_post) }

    it 'should update the order number for all given blog posts' do
      get :update_order_numbers, params: { blog_posts: [{ id: bpost.id, order_number: 2 }, { id: bpost1.id, order_number: 4 }].to_json }
      expect(bpost.reload.order_number).to eq 2
      expect(bpost1.reload.order_number).to eq 4
    end
  end

  describe '#update_featured_order_numbers' do
    let!(:bpost) { create(:blog_post) }
    let!(:bpost1) { create(:blog_post) }

    it 'should update the order number for all given blog posts' do
      get :update_featured_order_numbers, params: { blog_posts: [{ id: bpost.id, featured_order_number: 2 }, { id: bpost1.id, featured_order_number: 4 }].to_json }
      expect(bpost.reload.featured_order_number).to eq 2
      expect(bpost1.reload.featured_order_number).to eq 4
    end
  end
end
