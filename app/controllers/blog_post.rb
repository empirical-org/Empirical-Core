class Cms::BlogPostsController < ApplicationController
  before_filter :staff!
  before_action :set_blog_post, only: [:update, :destroy, :edit, :show]
  before_action :authors, :topics, only: [:edit, :new]

  def index
    @blog_posts = BlogPost.all
    #blog_posts/index.html.erb
  end

  private

  def set_blog_post
    @blog_post = BlogPost.find(params[:id])
  end

end
