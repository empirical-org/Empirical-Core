# frozen_string_literal: true

class BlogPostUserRatingsController < ApplicationController
  def create
    if current_user && BlogPostUserRating::ACCEPTABLE_RATINGS.include?(params[:rating].to_i)
      BlogPostUserRating.find_or_initialize_by(user_id: current_user.id, blog_post_id: params[:blog_post_id]).update(rating: params[:rating])
      render json: {}
    else
      render json: {}, status: 401
    end
  end
end
