class BlogPost < ActiveRecord::Base
  TOPICS = ['Case Studies', 'Teacher Stories', 'Webinars', 'Teacher Materials', 'Education Research']
  TOPIC_SLUGS = TOPICS.map { |topic| topic.downcase.gsub(' ','_') }

  before_create :generate_slug

  belongs_to :author

  def increment_read_count
    self.read_count += 1
    self.save
  end

  def path
    '/teacher_resources/' + self.slug
  end

  def topic_path
    '/teacher_resources/topic/' + self.topic_slug
  end

  def topic_slug
    self.topic.downcase.gsub(' ', '_')
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
