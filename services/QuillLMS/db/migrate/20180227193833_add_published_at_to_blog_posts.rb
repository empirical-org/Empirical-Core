class AddPublishedAtToBlogPosts < ActiveRecord::Migration[4.2]
  def change
    add_column :blog_posts, :published_at, :datetime
  end
end
