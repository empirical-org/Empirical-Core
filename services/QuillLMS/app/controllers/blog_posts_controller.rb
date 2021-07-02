class BlogPostsController < ApplicationController
  before_action :set_announcement, only: [:index, :show, :show_topic]
  before_action :set_role
  before_action :set_root_url

  def index
    topic_names = BlogPost::TEACHER_TOPICS
    @topics = []
    topic_names.each do |name|
      @topics.push({ name: name, slug: CGI::escape(name.downcase.gsub(' ','-'))})
    end
    @blog_posts = BlogPost.for_topics(topic_names)
  end

  def student_center_index
    @title = 'Resources'
    topic_names = BlogPost::STUDENT_TOPICS
    @topics = []
    topic_names.each do |name|
      @topics.push({ name: name, slug: CGI::escape(name.downcase.gsub(' ','-'))})
    end
    @blog_posts = BlogPost.for_topics(topic_names)
    render :index
  end

  def show
    # find_by_hash = { slug: params[:slug] }
    # find_by_hash[:draft] = false unless @role == 'staff'
    draft_status = (@role == 'staff') ? [true, false] : false

    @blog_post = BlogPost.find_by!(slug: params[:slug], draft: draft_status)
    # TODO remove SQL write from get endpoint
    @blog_post.increment_read_count
    @most_recent_posts = BlogPost.most_recent.where.not(id: @blog_post.id)

    @title = @blog_post.title
    @description = @blog_post.subtitle || @title
    @image_link = @blog_post.image_link
  rescue ActiveRecord::RecordNotFound => e
    # try fixing params and redirect to correct url.

    corrected_slug = params[:slug]&.gsub(/[^a-zA-Z\d\s-]/, '')&.downcase

    if blog_post = BlogPost.find_by(slug: corrected_slug, draft: draft_status)
      redirect_to blog_post
    else
      flash[:error] = "Oops! We can't seem to find that blog post. Trying searching on this page!"
      redirect_to blog_posts_path
    end


  end

  def search
    @query = params[:query]
    if params[:query].blank?
      flash[:error] = 'Oops! Please enter a search query.'
      return redirect_to :back
    end
    @blog_posts = RawSqlRunner.execute(
      <<-SQL
        SELECT
          slug,
          preview_card_content
        FROM blog_posts
        WHERE draft IS false
          AND topic != '#{BlogPost::IN_THE_NEWS}'
          AND tsv @@ plainto_tsquery(#{ActiveRecord::Base.sanitize(@query)})
        ORDER BY ts_rank(tsv, plainto_tsquery(#{ActiveRecord::Base.sanitize(@query)}))
      SQL
    ).to_a

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
      @blog_posts = BlogPost.for_topics(topic)
      # hide student part of topic name for display
      @title = @role == 'student' ? topic.gsub('Student ', '').capitalize : topic
      render 'index'
    end
  end

  private def set_announcement
    @announcement = Announcement.current_webinar_announcement
  end

  private def set_role
    @role = current_user ? current_user.role : nil
  end

  private def set_root_url
    @root_url = root_url
  end
end
