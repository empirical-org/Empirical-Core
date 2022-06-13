# frozen_string_literal: true

class BlogPostsController < ApplicationController
  before_action :redirect_legacy_topic_urls, only: [:show_topic]
  before_action :redirect_invalid_topics, only: [:show_topic]
  before_action :redirect_unauthorized_topics, only: [:show_topic]

  before_action :set_announcement, only: [:index, :show, :show_topic]
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

  # rubocop:disable Metrics/CyclomaticComplexity
  def show
    draft_statuses = current_user&.staff? ? [true, false] : false

    @blog_post = BlogPost.find_by(slug: params[:slug], draft: draft_statuses)

    if @blog_post
      # TODO: remove SQL write from GET endpoint
      @blog_post.increment_read_count
      @most_recent_posts = BlogPost.most_recent.where.not(id: @blog_post.id)

      @title = @blog_post.title
      @description = @blog_post.subtitle || @title
      @image_link = @blog_post.image_link
    else
      # try fixing params and redirect to correct url.
      corrected_slug = params[:slug]&.gsub(/[^a-zA-Z\d\s-]/, '')&.downcase
      blog_post = BlogPost.find_by(slug: corrected_slug, draft: draft_statuses)

      if blog_post
        redirect_to blog_post_path(blog_post.slug)
      else
        flash[:error] = "Oops! We can't seem to find that blog post. Trying searching on this page."
        redirect_to blog_posts_path
      end
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def search
    @query = params[:query]
    if params[:query].blank?
      flash[:error] = 'Oops! Please enter a search query.'
      return redirect_back(fallback_location: search_blog_posts_path)
    end
    @blog_posts = RawSqlRunner.execute(
      <<-SQL
        SELECT
          slug,
          preview_card_content
        FROM blog_posts
        WHERE draft IS false
          AND topic != '#{BlogPost::IN_THE_NEWS}'
          AND tsv @@ plainto_tsquery(#{ActiveRecord::Base.connection.quote(@query)})
        ORDER BY ts_rank(tsv, plainto_tsquery(#{ActiveRecord::Base.connection.quote(@query)}))
      SQL
    ).to_a

    @title = "Search: #{@query}"
    render 'index'
  end

  def show_topic
    topic = CGI::unescape(params[:topic]).gsub('-', ' ').capitalize

    @blog_posts = BlogPost.for_topics(topic)
    # hide student part of topic name for display
    @topic = current_user&.student? ? topic.gsub('Student ', '').capitalize : topic
    @title = @topic

    render 'index'
  end

  private def set_announcement
    @announcement = Announcement.current_webinar_announcement
  end

  private def set_root_url
    @root_url = root_url
  end

  private def redirect_unauthorized_topics
    return if params[:topic] != "using-quill-for-reading-comprehension"
    return if AppSetting.enabled?(name: AppSetting::COMPREHENSION, user: current_user)

    flash[:error] = "You are unauthorized to view that topic"
    redirect_to center_home_url and return
  end

  private def redirect_invalid_topics
    topic = CGI::unescape(params[:topic]).gsub('-', ' ').capitalize
    return if BlogPost::TOPICS.include?(topic)
    return if BlogPost::STUDENT_TOPICS.include?(topic)

    flash[:error] = "Oops! We can't seem to find that topic!"
    redirect_to center_home_url and return
  end

  # handling links that were possibly broken by changing slug function for topic names
  private def redirect_legacy_topic_urls
    return unless params[:topic].include?('_')

    new_topic = params[:topic].gsub('_', '-')
    redirect_to "#{center_home_url}/topic/#{new_topic}" and return
  end

  private def center_home_url
    current_user&.student? ? '/student-center' : '/teacher-center'
  end
end
