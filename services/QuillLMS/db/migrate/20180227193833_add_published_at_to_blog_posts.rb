class AddPublishedAtToBlogPosts < ActiveRecord::Migration
  def change
    add_column :blog_posts, :published_at, :datetime
  end
end
