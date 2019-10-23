class BlogPost < ActiveRecord::Base
  GETTING_STARTED = "Getting started"
  TEACHER_STORIES = "Teacher stories"
  WRITING_INSTRUCTION_RESEARCH = "Writing instruction research"
  PRESS_RELEASES = "Press releases"
  IN_THE_NEWS = "In the news"
  CASE_STUDIES = "Case studies"
  TEACHER_MATERIALS = "Teacher materials"
  BEST_PRACTICES = "Best practices"
  SUPPORT = "Support"
  WEBINARS = "Webinars"
  TWITTER_LOVE = "Twitter love"
  VIDEO_TUTORIALS = "Video tutorials"
  WHATS_NEW = "What's new?"

  STUDENT_GETTING_STARTED = 'Student getting started'
  STUDENT_HOW_TO = 'Student how to'

  HOW_TO = 'How to'
  ALL_RESOURCES = 'All resources'

  TOPICS = [
    GETTING_STARTED,
    TEACHER_STORIES,
    WRITING_INSTRUCTION_RESEARCH,
    PRESS_RELEASES,
    IN_THE_NEWS,
    CASE_STUDIES,
    TEACHER_MATERIALS,
    BEST_PRACTICES,
    SUPPORT,
    WEBINARS,
    TWITTER_LOVE,
    VIDEO_TUTORIALS,
    WHATS_NEW
  ]

  STUDENT_TOPICS = [STUDENT_GETTING_STARTED, STUDENT_HOW_TO]

  before_create :generate_slug, :set_order_number

  belongs_to :author
  has_many :blog_post_user_ratings
  after_save :add_published_at

  def set_order_number
    if self.order_number.nil?
      self.order_number =  BlogPost.where(topic: self.topic).count
    end
  end


  def increment_read_count
    self.read_count += 1
    self.save
  end

  def path
    if TOPICS.include?(self.topic)
      '/teacher-center/' + self.slug
    else
      '/student-center/' + self.slug
    end
  end

  def topic_path
    if TOPICS.include?(self.topic)
      '/teacher-center/topic/' + self.topic_slug
    else
      '/student-center/topic/' + self.topic_slug
    end
  end

  def topic_slug
    CGI::escape(self.topic.downcase.gsub(' ', '-'))
  end

  def can_be_accessed_by(user)
    return true unless self.premium
    return true if self.premium && user&.is_premium?
    false
  end

  def average_rating
    ratings = self.blog_post_user_ratings.pluck(:rating)
    return (ratings.sum / ratings.size).round(2) if ratings.any?
  end

  def add_published_at
    if !self.draft && !self.published_at
      self.update(published_at: DateTime.now)
    end
  end

  private
  def generate_slug
    title = self.title
    slug = title.gsub(/[^a-zA-Z\d\s]/, '').gsub(' ', '-').downcase

    # This looks for slugs that look like #{current-slug}-2 so we
    # can change our slug for this post to increment the end digit.
    existing_posts_with_incremented_slug = ActiveRecord::Base.connection.execute("SELECT slug FROM blog_posts WHERE slug ~* CONCAT(#{ActiveRecord::Base.sanitize(slug)}, '-\\d$');").to_a.map{ |h| h['slug'] }
    if existing_posts_with_incremented_slug.any?
      incremented_values = existing_posts_with_incremented_slug.map do |incremented_slug|
        incremented_slug.gsub("#{slug}-", '').to_i
      end
      new_incremented_value = incremented_values.max + 1
      return self.slug = "#{slug}-#{new_incremented_value}"
    end

    if BlogPost.exists?(slug: slug)
      return self.slug = "#{slug}-2"
    end

    self.slug = slug
  end
end
