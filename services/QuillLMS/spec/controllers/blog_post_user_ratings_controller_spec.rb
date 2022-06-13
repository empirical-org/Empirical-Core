# frozen_string_literal: true

require 'rails_helper'

RSpec.describe BlogPostUserRatingsController, type: :controller do
  describe '#create' do
    let(:blog_post) { create(:blog_post) }
    let(:teacher) { create(:teacher) }

    context 'when a user is logged in' do
      before do
        session[:user_id] = teacher.id
      end

      it 'should create a new rating' do
        post :create, params: { user_id: teacher.id, blog_post_id: blog_post.id, rating: 2 }
        expect(BlogPostUserRating.find_by(user_id: teacher.id, blog_post_id: blog_post.id).rating).to eq(2)
      end

      it 'should update an old rating' do
        BlogPostUserRating.create(user_id: teacher.id, blog_post_id: blog_post.id, rating: 0)
        expect(BlogPostUserRating.find_by(user_id: teacher.id, blog_post_id: blog_post.id).rating).to eq(0)
        post :create, params: { user_id: teacher.id, blog_post_id: blog_post.id, rating: 1 }
        expect(BlogPostUserRating.find_by(user_id: teacher.id, blog_post_id: blog_post.id).rating).to eq(1)
      end

      it 'should not create a rating if the specified rating is not in ACCEPTABLE_RATINGS' do
        post :create, params: { user_id: teacher.id, blog_post_id: blog_post.id, rating: BlogPostUserRating::ACCEPTABLE_RATINGS.max + 1 }
        expect(response.status).to be(401)
      end
    end

    context 'when no user is logged in' do
      it 'should return an unauthorized error' do
        post :create, params: { user_id: teacher.id, blog_post_id: blog_post.id, rating: 2 }
        expect(response.status).to be(401)
      end
    end
  end
end
