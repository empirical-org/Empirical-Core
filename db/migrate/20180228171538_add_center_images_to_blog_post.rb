class AddCenterImagesToBlogPost < ActiveRecord::Migration
  def change
    add_column :blog_posts, :center_images, :boolean
  end
end
