class BlogPostsController < ApplicationController
  before_action :set_announcement, only: [:index, :show, :show_topic]
  before_action :set_role

  def index
    @topics = BlogPost::TOPICS
    @blog_posts = BlogPost.where(draft: false, topic: @topics).order('order_number')
  end

  def student_center_index
    @topics = BlogPost::STUDENT_TOPICS
    @blog_posts = BlogPost.where(draft: false, topic: @topics)
    render :index
  end

  def show
    find_by_hash = { slug: params[:slug] }
    find_by_hash[:draft] = false unless @role == 'staff'
    @blog_post = BlogPost.find_by!(find_by_hash)
    @topic = @blog_post.topic
    @display_paywall = true unless @blog_post.can_be_accessed_by(current_user)
    @blog_post.increment_read_count
    @author = @blog_post.author
    @most_recent_posts = BlogPost.where("draft = false AND id != #{@blog_post.id}").order('updated_at DESC').limit(3)
    @title = @blog_post.title
    @description = @blog_post.subtitle || @title
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
    @title = "Search: #{@query}"
    return render 'index'
  end

  def show_topic
    # handling links that were possibly broken by changing slug function for topic names
    if params[:topic].include?('_')
      new_topic = params[:topic].gsub('_', '-')
      if current_user.role == 'student'
        redirect_to "/student-center/topic/#{new_topic}"
      else
        redirect_to "/teacher-center/topic/#{new_topic}"
      end
    else
      if !BlogPost::TOPIC_SLUGS.include?(params[:topic]) && !BlogPost::STUDENT_TOPIC_SLUGS.include?(params[:topic])
        raise ActionController::RoutingError.new('Topic Not Found')
      end
      topic = params[:topic].gsub('-', ' ').titleize
      @blog_posts = BlogPost.where(draft: false, topic: topic).order('order_number')
      # hide student part of topic name for display
      @title = @role == 'student' ? topic.gsub('Student ', '') : topic
      return render 'index'
    end
  end

  private
  def set_announcement
    @announcement = Announcement.get_current_webinar_announcement
  end

  def set_role
    @role = current_user ? current_user.role : nil
  end
end
