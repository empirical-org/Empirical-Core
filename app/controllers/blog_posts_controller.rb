class BlogPostsController < ApplicationController
  def index
    @blog_posts = BlogPost.where(draft: false)
    @announcement = Announcement.get_current_webinar_announcement
  end

  def show
    @blog_post = BlogPost.find_by(slug: params[:slug])
    @blog_post.increment_read_count
  end

  def show_topic
    if !BlogPost::TOPIC_SLUGS.include?(params[:topic])
      raise ActionController::RoutingError.new('Topic Not Found')
    end
    @blog_posts = BlogPost.where(draft: false, topic: params[:topic].gsub('_', ' ').titleize)
    return render 'index'
  end
end
