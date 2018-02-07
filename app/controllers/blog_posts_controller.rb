class BlogPostsController < ApplicationController
  before_action :set_blog_post, only: [:show]

  def index
    @blog_posts = BlogPost.where(draft: false)
    @announcement = Announcement.get_current_webinar_announcement
    #blog_posts/index.html.erb
  end

  def show
  end


  private

  def set_blog_post
    @blog_post = BlogPost.find(params[:id])
  end

end
