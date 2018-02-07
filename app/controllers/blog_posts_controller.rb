class BlogPostsController < ApplicationController
  def index
    @blog_posts = BlogPost.where(draft: false)
    @announcement = Announcement.get_current_webinar_announcement
    #blog_posts/index.html.erb
  end

  def show
    @blog_post = BlogPost.find_by(slug: params[:slug])
    @blog_post.increment_read_count
  end
end
