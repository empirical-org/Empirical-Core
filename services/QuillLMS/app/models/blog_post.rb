class BlogPost < ActiveRecord::Base
  TOPICS = ['Getting Started', 'Teacher Stories', 'Writing Instruction Research', 'Announcements', 'Press', 'Case Studies', 'Teacher Materials', 'Best Practices', 'Support', 'Webinars', 'Twitter Love', 'Video Tutorials']
  STUDENT_TOPICS = ['Student Getting Started', 'Student How To']
  TOPIC_SLUGS = TOPICS.map { |topic| topic.downcase.gsub(' ','-') }
  STUDENT_TOPIC_SLUGS = STUDENT_TOPICS.map { |topic| topic.downcase.gsub(' ','-') }

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
    if TOPICS.includes(self.topic)
      '/teacher-center/' + self.slug
    else
      '/student-center/' + self.slug
    end
  end

  def topic_path
    if TOPICS.includes(self.topic)
      '/teacher-center/topic/' + self.topic_slug
    else
      '/student-center/topic/' + self.topic_slug
    end
  end

  def topic_slug
    self.topic.downcase.gsub(' ', '_')
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
    existing_posts_with_incremented_slug = ActiveRecord::Base.connection.execute("SELECT slug FROM blog_posts WHERE slug ~* '#{slug}-\\d$';").to_a.map{ |h| h['slug'] }
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
