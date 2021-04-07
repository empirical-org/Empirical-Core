class BlogPostsController < ApplicationController
  before_action :set_announcement, only: [:index, :show, :show_topic]
  before_action :set_role

  def index
    topic_names = BlogPost::TEACHER_TOPICS
    @topics = []
    topic_names.each do |name|
      @topics.push({ name: name, slug: CGI::escape(name.downcase.gsub(' ','-'))})
    end
    @blog_posts = BlogPost.where(draft: false, topic: topic_names).order('order_number')
  end

  def student_center_index
    @title = 'Resources'
    topic_names = BlogPost::STUDENT_TOPICS
    @topics = []
    topic_names.each do |name|
      @topics.push({ name: name, slug: CGI::escape(name.downcase.gsub(' ','-'))})
    end
    @blog_posts = BlogPost.where(draft: false, topic: topic_names)
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
    @image_link = @blog_post.image_link
  end

  def search
    @query = params[:query]
    if params[:query].blank?
      flash[:error] = 'Oops! Please enter a search query.'
      return redirect_back(fallback_location: search_blog_posts_path)
    end
    @blog_posts = ActiveRecord::Base.connection.execute("
      SELECT slug, preview_card_content
      FROM blog_posts
      WHERE draft IS FALSE
      AND topic != '#{BlogPost::IN_THE_NEWS}'
      AND tsv @@ plainto_tsquery(#{ActiveRecord::Base.sanitize(@query)})
      ORDER BY ts_rank(tsv, plainto_tsquery(#{ActiveRecord::Base.sanitize(@query)}))
    ").to_a
    @title = "Search: #{@query}"
    render 'index'
  end

  def show_topic
    # handling links that were possibly broken by changing slug function for topic names
    if params[:topic].include?('_')
      new_topic = params[:topic].gsub('_', '-')
      if current_user&.role == 'student'
        redirect_to "/student-center/topic/#{new_topic}"
      else
        redirect_to "/teacher-center/topic/#{new_topic}"
      end
    else
      topic = CGI::unescape(params[:topic]).gsub('-', ' ').capitalize
      if !BlogPost::TOPICS.include?(topic) && !BlogPost::STUDENT_TOPICS.include?(topic)
        raise ActionController::RoutingError, 'Topic Not Found'
      end
      @blog_posts = BlogPost.where(draft: false, topic: topic).order('order_number')
      # hide student part of topic name for display
      @title = @role == 'student' ? topic.gsub('Student ', '').capitalize : topic
      render 'index'
    end
  end

  private
  def set_announcement
    @announcement = Announcement.current_webinar_announcement
  end

  def set_role
    @role = current_user ? current_user.role : nil
  end
end
