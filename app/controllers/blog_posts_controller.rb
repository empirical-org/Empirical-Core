class BlogPostsController < ApplicationController
  before_action :set_announcement, only: [:index, :show, :show_topic]

  def index
    @blog_posts = BlogPost.where(draft: false)
  end

  def show
    find_by_hash = { slug: params[:slug] }
    find_by_hash[:draft] = false unless current_user&.role == 'staff'
    @blog_post = BlogPost.find_by!(find_by_hash)
    @display_paywall = true unless @blog_post.can_be_accessed_by(current_user)
    @blog_post.increment_read_count
    @author = @blog_post.author
    @most_recent_posts = BlogPost.where("draft = false AND id != #{@blog_post.id}").order('updated_at DESC').limit(3)
  end

  def search
    @query = params[:query]
    if params[:query].blank?
      flash[:error] = 'Oops! Please enter a search query.'
      return redirect_to :back
    end
    @blog_posts = ActiveRecord::Base.connection.execute("
      SELECT slug, preview_card_content
      FROM blog_posts
      WHERE draft IS FALSE AND tsv @@ plainto_tsquery(#{ActiveRecord::Base.sanitize(@query)})
      ORDER BY ts_rank(tsv, plainto_tsquery(#{ActiveRecord::Base.sanitize(@query)}))
    ").to_a
    return render 'index'
  end

  def show_topic
    if !BlogPost::TOPIC_SLUGS.include?(params[:topic])
      raise ActionController::RoutingError.new('Topic Not Found')
    end
    @blog_posts = BlogPost.where(draft: false, topic: params[:topic].gsub('_', ' ').titleize)
    return render 'index'
  end

  # TODO: remove this when we launch front end of knowlege center
  def temporarily_render_old_teacher_resources
    return render 'pages/teacher_resources'
  end

  private
  def set_announcement
    @announcement = Announcement.get_current_webinar_announcement
  end
end
