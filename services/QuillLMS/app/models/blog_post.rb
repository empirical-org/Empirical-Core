# frozen_string_literal: true

# == Schema Information
#
# Table name: blog_posts
#
#  id                    :integer          not null, primary key
#  body                  :text             not null
#  center_images         :boolean
#  draft                 :boolean          default(TRUE)
#  external_link         :string
#  featured_order_number :integer
#  image_link            :string
#  order_number          :integer
#  premium               :boolean          default(FALSE)
#  press_name            :string
#  preview_card_content  :text             not null
#  published_at          :datetime
#  read_count            :integer          default(0), not null
#  slug                  :string
#  subtitle              :text
#  title                 :string           not null
#  topic                 :string
#  tsv                   :tsvector
#  created_at            :datetime
#  updated_at            :datetime
#  author_id             :integer
#
# Indexes
#
#  index_blog_posts_on_author_id   (author_id)
#  index_blog_posts_on_read_count  (read_count)
#  index_blog_posts_on_slug        (slug) UNIQUE
#  index_blog_posts_on_title       (title)
#  index_blog_posts_on_topic       (topic)
#  tsv_idx                         (tsv) USING gin
#
class BlogPost < ApplicationRecord
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
  USING_QUILL_FOR_READING_COMPREHENSION = "Using quill for reading comprehension"

  STUDENT_GETTING_STARTED = 'Student getting started'
  STUDENT_HOW_TO = 'Student how to'

  HOW_TO = 'How to'
  ALL_RESOURCES = 'All resources'

  WHATS_NEW_SLUG = 'whats-new'

  TOPICS = [
    WHATS_NEW,
    USING_QUILL_FOR_READING_COMPREHENSION,
    GETTING_STARTED,
    BEST_PRACTICES,
    WEBINARS,
    VIDEO_TUTORIALS,
    TEACHER_MATERIALS,
    WRITING_INSTRUCTION_RESEARCH,
    TEACHER_STORIES,
    PRESS_RELEASES,
    IN_THE_NEWS,
    CASE_STUDIES,
    SUPPORT,
    TWITTER_LOVE
  ]

  TEACHER_TOPICS = TOPICS.reject { |t| [PRESS_RELEASES, IN_THE_NEWS].include?(t) }

  STUDENT_TOPICS = [STUDENT_GETTING_STARTED, STUDENT_HOW_TO]
  MOST_RECENT_LIMIT = 12

  before_create :generate_slug, :set_order_number

  belongs_to :author
  has_many :blog_post_user_ratings
  after_save :add_published_at

  scope :live, -> { where(draft: false) }
  scope :for_topics, ->(topic) { live.order('order_number ASC').where(topic: topic) }

  def set_order_number
    return if order_number.present?

    self.order_number =  BlogPost.where(topic: topic).count
  end


  def increment_read_count
    self.read_count += 1
    save
  end

  def path
    if TOPICS.include?(topic)
      "/teacher-center/#{slug}"
    else
      "/student-center/#{slug}"
    end
  end

  def topic_path
    if TOPICS.include?(topic)
      "/teacher-center/topic/#{topic_slug}"
    else
      "/student-center/topic/#{topic_slug}"
    end
  end

  def topic_slug
    CGI::escape(topic.downcase.gsub(' ', '-'))
  end

  def can_be_accessed_by(user)
    return true unless premium
    return true if premium && user&.is_premium?

    false
  end

  def average_rating
    ratings = blog_post_user_ratings.pluck(:rating)
    return (ratings.sum / ratings.size).round(2) if ratings.any?
  end

  def add_published_at
    return if draft
    return if published_at

    update(published_at: DateTime.current)
  end

  def related_posts
    BlogPost
      .where(topic: topic)
      .where.not(id: id)
      .order(created_at: :desc)
      .limit(MOST_RECENT_LIMIT)
  end

  private def generate_slug
    title = self.title
    slug = title.gsub(/[^a-zA-Z\d\s]/, '').gsub(' ', '-').downcase
    # This looks for slugs that look like #{current-slug}-2 so we
    # can change our slug for this post to increment the end digit.
    existing_posts_with_incremented_slug = RawSqlRunner.execute(
      <<-SQL
        SELECT slug
        FROM blog_posts
        WHERE slug ~* CONCAT(#{ActiveRecord::Base.connection.quote(slug)}, '-\\d$')
      SQL
    ).values.flatten

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
