class Cms::BlogPostsController < ApplicationController
  before_filter :staff!

  def index
    @blog_posts_name_and_id = BlogPost.all.select('title', 'id')
  end

  def new
  end

  def edit
  end

  def create

  end

  def update

  end

  def destroy

  end

  private

end
