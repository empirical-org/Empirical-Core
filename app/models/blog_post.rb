class BlogPost < ActiveRecord::Base
  TOPICS = ['other', 'biking', 'cycling']

  before_create :generate_slug

  belongs_to :author

  private
  def generate_slug
    title = self.title
    slug = title.gsub(/[^a-zA-Z\d\s]/, '').gsub(' ', '-').downcase

    # TODO: revisit the following logic once the redirects table is
    # implemented to account for the fact that a blog post's slug
    # could have been changed but also exist in the redirects table.

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
